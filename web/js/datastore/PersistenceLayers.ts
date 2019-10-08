import {PersistenceLayer} from "./PersistenceLayer";
import {ASYNC_NULL_FUNCTION, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AsyncFunction, AsyncWorkQueue} from '../util/AsyncWorkQueue';
import {DocMetaRef} from "./DocMetaRef";
import {Datastore, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, SyncDoc, SyncDocMap, SyncDocs} from './Datastore';
import {UUIDs} from '../metadata/UUIDs';
import {ProgressListener, ProgressTracker} from '../util/ProgressTracker';
import {DocMetas} from '../metadata/DocMetas';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {isPresent} from 'polar-shared/src/Preconditions';
import {URLs} from "polar-shared/src/util/URLs";
import {Logger} from "polar-shared/src/logger/Logger";
import {BackendFileRefs} from './BackendFileRefs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";

const log = Logger.create();

export class PersistenceLayers {

    /**
     * Change visibility of the given DocMeta including setting the visibility
     * itself on the DocInfo but also setting the visibility for the individual
     * files.
     *
     */
    public static async changeVisibility(store: PersistenceLayer,
                                         docMeta: IDocMeta,
                                         visibility: Visibility) {

        log.info("Changing document visibility changed to: ", visibility);

        const backendFileRefs = BackendFileRefs.toBackendFileRefs(docMeta);

        const writeFileOpts = {visibility, updateMeta: true};

        const toWriteFilePromise = async (backendFileRef: BackendFileRef): Promise<void> => {

            await store.writeFile(backendFileRef.backend,
                                  backendFileRef,
                                  undefined!,
                                  writeFileOpts);

        };

        const toWriteFilePromises = (): ReadonlyArray<Promise<void>> => {
            return backendFileRefs.map(current => toWriteFilePromise(current));
        };

        const toWriteDocMetaPromise = async (): Promise<void> => {

            docMeta.docInfo.visibility = visibility;

            await store.writeDocMeta(docMeta);

        };

        const writeFilePromises = toWriteFilePromises();
        const writeDocMetaPromise = toWriteDocMetaPromise();

        const promises = [...writeFilePromises, writeDocMetaPromise];

        await Promise.all(promises);

        log.info("Document visibility changed to: ", visibility);

    }

    public static toPersistenceLayer(input: Datastore ): PersistenceLayer {
        return new DefaultPersistenceLayer(input);
    }

    public static async toSyncDocMap(datastore: Datastore,
                                     progressStateListener: ProgressListener = NULL_FUNCTION) {

        const docMetaFiles = await datastore.getDocMetaRefs();

        return this.toSyncDocMapFromDocs(datastore, docMetaFiles, progressStateListener);

    }

    public static async toSyncDocMapFromDocs(datastore: Datastore,
                                             docMetaRefs: DocMetaRef[],
                                             progressStateListener: ProgressListener = NULL_FUNCTION) {

        const syncDocsMap: SyncDocMap = {};

        const work: AsyncFunction[] = [];
        const asyncWorkQueue = new AsyncWorkQueue(work);

        const progressTracker = new ProgressTracker(docMetaRefs.length,
                                                    `datastore:${datastore.id}#toSyncDocMapFromDocs`);

        for (const docMetaRef of docMetaRefs) {

            work.push(async () => {

                let docMeta: IDocMeta | undefined = docMetaRef.docMeta;

                if (! docMeta) {

                    const data = await datastore.getDocMeta(docMetaRef.fingerprint);

                    if (isPresent(data)) {
                        docMeta = DocMetas.deserialize(data!, docMetaRef.fingerprint);
                    }

                }

                if (isPresent(docMeta)) {

                    syncDocsMap[docMetaRef.fingerprint] = SyncDocs.fromDocInfo(docMeta!.docInfo, 'created');

                    progressStateListener(progressTracker.peek());

                } else {
                    // there is no doc for this fingerprint.
                }

            });

        }

        await asyncWorkQueue.execute();

        progressStateListener(progressTracker.terminate());

        return syncDocsMap;

    }

    /**
     * Merge both origins so that they contains the same documents. Older
     * documents are upgraded to the latest version and missing documents are
     * copied.  At the end both origins will have the union of both sets.
     */
    public static async merge(syncOrigin0: SyncOrigin,
                              syncOrigin1: SyncOrigin,
                              listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION) {

        await this.transfer(syncOrigin0, syncOrigin1, listener);

        // now transfer the other way...

        await this.transfer(syncOrigin1, syncOrigin0, listener);

    }

    /**
     * Make sure the latest version of the files are in both origins.
     */
    public static async synchronizeOrigins(localSyncOrigin: SyncOrigin,
                                           cloudSyncOrigin: SyncOrigin,
                                           listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION): Promise<void> {

        // log.notice("local: " + localSyncOrigin.datastore.id);
        // log.notice("cloud: " + cloudSyncOrigin.datastore.id);

        log.notice("Transferring from local -> cloud...");
        const localToCloud = await PersistenceLayers.transfer(localSyncOrigin, cloudSyncOrigin, listener, 'local-to-cloud');
        log.notice("Transferring from local -> cloud...done", localToCloud);

        log.notice("Transferring from cloud -> local...");
        const cloudToLocal = await PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, listener, 'cloud-to-local');
        log.notice("Transferring from cloud -> local...done", cloudToLocal);

    }

    /**
     * Synchronize the source with the target so that we know they are both in
     * sync.
     */
    public static async transfer(source: SyncOrigin,
                                 target: SyncOrigin,
                                 listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION,
                                 id: string = 'none'): Promise<TransferResult> {

        // TODO: include warnings as part of the transfer so that they can be
        // logged and so that we can tell the user.

        // TODO: no errors are actually raised on the copy operations that are
        // operating in the async queue.  These need to be bubbled up.  This
        // function could just take an error listener and call back that way
        // or we could reject the promise result.

        const result = {
            docMeta: {
                total: 0,
                writes: 0
            },
            files: {
                total: 0,
                writes: 0
            }
        };

        async function handleSyncFile(syncDoc: SyncDoc, fileRef: BackendFileRef) {

            ++result.files.total;

            const containsFile = async (datastore: Datastore,
                                        id: 'source' | 'target'): Promise<boolean> => {

                try {
                    return await datastore.containsFile(fileRef.backend, fileRef);
                } catch (e) {
                    log.error(`Could not get file ${fileRef.name} for doc with fingerprint: ${syncDoc.fingerprint} from ${id}`, fileRef, e);
                    throw e;
                }

            };

            const targetContainsFile = await containsFile(target.datastore, 'target');

            if (! targetContainsFile) {

                const sourceContainsFile =  await containsFile(source.datastore, 'source');

                if (sourceContainsFile) {

                    const sourceFile = source.datastore.getFile(fileRef.backend, fileRef);

                    const blob = await URLs.toBlob(sourceFile.url);

                    await target.datastore.writeFile(sourceFile.backend, fileRef, blob);

                    ++result.files.writes;

                } else {
                    log.warn(`Both the target and source files are missing in doc ${syncDoc.fingerprint} (${syncDoc.title}): `, fileRef);
                }

            }

        }

        /**
         * Handle synchronizing the individual docs files from a reference.
         *
         * @param sourceSyncDoc The source sync doc we're trying to ensure is
         *                      in the target datastore and up to date.
         * @param [targetSyncDoc] The targetSyncDoc which may not exist yet in
         *                        target datastore.
         */
        async function handleSyncDoc(sourceSyncDoc: SyncDoc, targetSyncDoc?: SyncDoc) {

            ++result.docMeta.total;

            for (const sourceSyncFile of sourceSyncDoc.files) {

                if (sourceSyncFile.name) {
                    // TODO: if we use the second queue it still locks up.
                    // await docFileAsyncWorkQueue.enqueue(async () =>
                    // handleStashFile(docFile));
                    await handleSyncFile(sourceSyncDoc, sourceSyncFile);
                }

            }

            let doWriteDocMeta: boolean = ! targetSyncDoc;

            if (targetSyncDoc) {

                const cmp = UUIDs.compare(targetSyncDoc.uuid, sourceSyncDoc.uuid);

                // TODO: if the comparison is zero then technically we
                // have a conflict which we need to surface to the user but this
                // is insanely rare.

                doWriteDocMeta = cmp < 0;

            }

            if (doWriteDocMeta) {

                const data = await source.datastore.getDocMeta(sourceSyncDoc.fingerprint);

                if (data) {
                    await target.datastore.write(sourceSyncDoc.fingerprint, data!, sourceSyncDoc.docMetaFileRef.docInfo);
                } else {
                    log.warn("No data for fingerprint: " + sourceSyncDoc.fingerprint);
                }

                ++result.docMeta.writes;

            }

            const progress = progressTracker.incr();

            const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
                datastore: source.datastore.id,
                progress,

                // this should be committed as we're starting with the source
                // which we think should be at the commmitted level to start
                // with

                consistency: 'committed',

                // TODO: we're not re-emitting the doc mutations at this stage
                // as I think this is the appropriate action since we should
                // already know that they have been present and we're just
                // emitting progress.
                docMetaMutations: [
                ]

            };

            await listener(docMetaSnapshotEvent);

        }

        const docFileAsyncWorkQueue = new AsyncWorkQueue([]);
        const docMetaAsyncWorkQueue = new AsyncWorkQueue([]);

        const sourceSyncDocs = Object.values(source.syncDocMap);

        const progressID
            = `transfer:source=${source.datastore.id},target=${target.datastore.id}`;

        const progressTracker = new ProgressTracker(sourceSyncDocs.length, progressID);

        for (const sourceSyncDoc of sourceSyncDocs) {

            const targetSyncDoc = target.syncDocMap[sourceSyncDoc.fingerprint];

            const handler = async () => {

                try {
                    await handleSyncDoc(sourceSyncDoc, targetSyncDoc);
                } catch (e) {
                    log.error("Unable to sync between source and target: ", {sourceSyncDoc, targetSyncDoc}, e);
                }

            };

            docMetaAsyncWorkQueue.enqueue(handler);


        }

        // build a work queue of async functions out of the docMetaFiles.

        const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
        const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();

        await Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);

        await listener({
            datastore: source.datastore.id,
            progress: progressTracker.terminate(),
            consistency: 'committed',
            docMetaMutations: []
        });

        return result;

    }

}

export interface TransferResult {

    docMeta: TransferMetrics;

    files: TransferMetrics;

}

export interface TransferMetrics {
    total: number;
    writes: number;
}


export interface SyncOrigin {

    readonly datastore: Datastore;
    readonly syncDocMap: SyncDocMap;

}

