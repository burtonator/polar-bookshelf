import {AbstractDatastore, BinaryFileData, Datastore, DatastoreOverview, DeleteResult, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, DocMetaSnapshotEvents, ErrorListener, FileSynchronizationEvent, FileSynchronizationEventListener, InitResult, PrefsProvider, SnapshotResult, SyncDocMap, SyncDocMaps, SynchronizationEvent, SynchronizationEventListener, SynchronizingDatastore} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {NetworkLayer} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {WriteOpts} from './Datastore';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {UUID} from 'polar-shared/src/metadata/UUID';
import {Logger} from "polar-shared/src/logger/Logger";
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {PersistenceLayers, SyncOrigin} from './PersistenceLayers';
import {DocMetaSnapshotEventListeners, EventDeduplicator} from './DocMetaSnapshotEventListeners';
import {ASYNC_NULL_FUNCTION, NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {AsyncFunction} from '../util/AsyncWorkQueue';
import * as firebase from '../firebase/lib/firebase';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Datastores} from './Datastores';
import {Either} from '../util/Either';
import {BackendFileRefs} from './BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

export interface CloudAwareDeleteResult extends DeleteResult {

}

/**
 * A CloudAwareDatastore allows us to have one datastore with a local copy and
 * remote datastore backing them.  Reads are resolved via the local data store
 * and writes are resolved to both the remote and local concurrently.
 * The reverse is true too. If we startup and there is an excess file in the
 * remote, it's copied local.
 */
export class CloudAwareDatastore extends AbstractDatastore implements Datastore, SynchronizingDatastore {

    // allows us to keep track of the snapshot id so that when we report errors
    // we can know which snapshot failed.
    private static SNAPSHOT_ID = 0;

    public readonly id = 'cloud-aware';

    public readonly local: Datastore;

    public readonly cloud: Datastore;

    private readonly fileSynchronizationEventDispatcher: IEventDispatcher<FileSynchronizationEvent> = new SimpleReactor();

    private readonly synchronizationEventDispatcher: IEventDispatcher<SynchronizationEvent> = new SimpleReactor();

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    private readonly docMetaComparisonIndex = new DocMetaComparisonIndex();

    private primarySnapshot?: SnapshotResult;

    public shutdownHook: AsyncFunction = ASYNC_NULL_FUNCTION;

    constructor(local: Datastore, cloud: Datastore) {
        super();
        this.local = local;
        this.cloud = cloud;
    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION,
                      opts: DatastoreInitOpts = {noInitialSnapshot: false, noSync: false}): Promise<InitResult> {

        await Promise.all([
            this.cloud.init(errorListener, {noInitialSnapshot: true}),
            this.local.init(errorListener)
        ]);

        const snapshotListener = async (event: DocMetaSnapshotEvent) => this.docMetaSnapshotEventDispatcher.dispatchEvent(event);

        if (! opts.noSync) {
            this.primarySnapshot = await this.snapshot(snapshotListener, errorListener);
        }

        return {};

    }

    public async stop() {

        // TODO: all snapshots that have been handed out should be stopped...

        // we have to have the shutdown run BEFORE we actually shut down or we
        // might be weird and unusual behavior.
        await this.shutdownHook();

        if (this.primarySnapshot && this.primarySnapshot.unsubscribe) {
            this.primarySnapshot.unsubscribe();
        }

        await Promise.all([this.cloud.stop(), this.local.stop()]);

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: BinaryFileData,
                           opts: WriteFileOpts = {}): Promise<DocFileMeta> {

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        const result = await this.local.writeFile(backend, ref, data, opts);
        datastoreMutation.written.resolve(true);

        // don't await the cloud write.  Once it's written locally we're fine
        // if it's not in the cloud we get an error logged and we should also
        // have task progress in the future.
        this.cloud.writeFile(backend, ref, data, opts)
            .then(() => {
                datastoreMutation.committed.resolve(true);
            })
            .catch(err => log.error("Unable to write file to cloud: ", err));

        return result;

    }

    public getFile(backend: Backend, ref: FileRef, opts: GetFileOpts = {}): DocFileMeta {

        Datastores.assertNetworkLayer(this, opts.networkLayer);

        if (! opts.networkLayer || opts.networkLayer === 'local') {
            return this.local.getFile(backend, ref);
        } else {
            return this.cloud.getFile(backend, ref);
        }

    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.local.containsFile(backend, ref);
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        await this.cloud.deleteFile(backend, ref);

        return this.local.deleteFile(backend, ref);

    }

    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()):
        Promise<Readonly<CloudAwareDeleteResult>> {

        datastoreMutation.written.get()
            .then(() => {

                this.docMetaComparisonIndex.remove(docMetaFileRef.fingerprint);

            })
            // this should never fail in practice.
            .catch(err => log.error("Could not handle delete: ", err));

        await this.datastoreMutations.executeBatchedWrite(datastoreMutation,
                                                          async (remoteCoordinator) => {
                                                              await this.cloud.delete(docMetaFileRef, remoteCoordinator);
                                                          },
                                                          async (localCoordinator) => {
                                                              await this.local.delete(docMetaFileRef, localCoordinator);
                                                          });

        return {};

    }

    public async write(fingerprint: string,
                       data: string,
                       docInfo: IDocInfo,
                       opts: WriteOpts = {}): Promise<void> {

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        const writeFileDatastoreMutation = new DefaultDatastoreMutation<boolean>();

        if (opts.writeFile) {

            await this.writeFile(opts.writeFile.backend,
                                 opts.writeFile,
                                 opts.writeFile.data,
                                 {datastoreMutation: writeFileDatastoreMutation});

        } else {
            writeFileDatastoreMutation.written.resolve(true);
            writeFileDatastoreMutation.committed.resolve(true);
        }

        datastoreMutation
            .written.get().then(() => {

            this.docMetaComparisonIndex.updateUsingDocInfo(docInfo);

        })
        .catch(err => log.error("Could not handle delete: ", err));


        await this.datastoreMutations.executeBatchedWrite(datastoreMutation,
                                                           async (remoteCoordinator) => {

                                                               // before we write the DocMeta data to the
                                                               // cloud we have to wait until the file is
                                                               // written.
                                                               await writeFileDatastoreMutation.committed.get();

                                                               await this.cloud.write(fingerprint, data, docInfo, {datastoreMutation: remoteCoordinator});

                                                           },
                                                           async (localCoordinator) => {
                                                               await this.local.write(fingerprint, data, docInfo, {datastoreMutation: localCoordinator});
                                                           });

    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.local.getDocMetaRefs();
    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]) {

        log.info("CloudAwareDatastore: synchronizeDocs: ", docMetaRefs);

        const toSyncOrigin = async (datastore: Datastore, ...docMetaRefs: DocMetaRef[]): Promise<SyncOrigin> => {

            const syncDocMap = await PersistenceLayers.toSyncDocMapFromDocs(datastore, docMetaRefs);

            return {
                datastore,
                syncDocMap
            };

        };

        const clearDocMeta = (...docMetaRefs: DocMetaRef[]): DocMetaRef[] => {
            return docMetaRefs.map(current => {

                return {
                    fingerprint: current.fingerprint
                };

            });
        };

        const cloudSyncOrigin = await toSyncOrigin(this.cloud, ...clearDocMeta(...docMetaRefs));
        const localSyncOrigin = await toSyncOrigin(this.local, ...docMetaRefs);

        // TODO: there are no events with this and the UI won't be updated.
        // the problme is that I don't think we can re-send the event data
        // because we only want the progress updated.
        //
        // TODO: we could resolve this by removing the mutations and just
        // sending the progress data.

        await PersistenceLayers.synchronizeOrigins(localSyncOrigin, cloudSyncOrigin, ASYNC_NULL_FUNCTION);

    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        const isPrimarySnapshot: boolean = this.primarySnapshot === undefined;

        const snapshotID = CloudAwareDatastore.SNAPSHOT_ID++;

        const deduplicatedListener = DocMetaSnapshotEventListeners.createDeduplicatedListener(async docMetaSnapshotEvent => {
            await docMetaSnapshotEventListener(docMetaSnapshotEvent);
        });

        class InitialSnapshotLatch {

            public readonly syncDocMap: SyncDocMap = {};
            public readonly latch = new Latch<boolean>();
            public readonly id: CloudDatastoreID;

            private hasInitialTerminatedBatch: boolean = false;

            private pending: number = 0;

            constructor(id: CloudDatastoreID) {
                this.id = id;
            }

            private async handleSnapshot(docMetaSnapshotEvent: DocMetaSnapshotEvent) {

                // const snapDesc =
                // DocMetaSnapshotEvents.format(docMetaSnapshotEvent);

                try {

                    if (this.hasInitialTerminatedBatch) {
                        return;
                    }

                    if (! docMetaSnapshotEvent.batch || docMetaSnapshotEvent.batch.id !== 0) {
                        return;
                    }

                    ++this.pending;

                    const syncDocs = await DocMetaSnapshotEvents.toSyncDocs(docMetaSnapshotEvent);
                    SyncDocMaps.putAll(this.syncDocMap, syncDocs);

                    if (docMetaSnapshotEvent.consistency === 'committed' &&
                        docMetaSnapshotEvent.batch!.terminated) {

                        const nrDocs = Dictionaries.size(this.syncDocMap);

                        this.hasInitialTerminatedBatch = true;

                    }

                } finally {

                    --this.pending;


                    if (this.hasInitialTerminatedBatch && this.pending === 0) {
                        this.latch.resolve(true);
                    }

                }

            }

            public createSnapshot(datastore: Datastore) {

                return datastore.snapshot(async docMetaSnapshotEvent => {

                    if (! initialSyncCompleted) {
                        await this.handleSnapshot(docMetaSnapshotEvent);
                    }

                    // always forward to the synchronizing listener
                    await synchronizingListener(docMetaSnapshotEvent);

                }, errorListener);

            }

        }

        let initialSyncCompleted: boolean = false;

        // The way this algorithm works is that we load the local store first
        // and on the first snapshot we keep an index of the fingerprint to
        // UUID... then we wait until we can get the similar index from the
        // 'committed' version of the cloud datastore, then we perform a
        // synchronize based on this metadata... at which point we synchronize
        // both datasources.

        const localInitialSnapshotLatch = new InitialSnapshotLatch('local');
        const cloudInitialSnapshotLatch = new InitialSnapshotLatch('cloud');

        const synchronizingEventDeduplicator: EventDeduplicator
            = DocMetaSnapshotEventListeners.createDeduplicatedListener(async docMetaSnapshotEvent => {

            const handleEvent = async () => {

                try {

                    if (initialSyncCompleted && isPrimarySnapshot) {
                        await this.handleSnapshotSynchronization(docMetaSnapshotEvent, deduplicatedListener.listener);
                    }

                } finally {
                    // need to pass on these events after the replication.
                    await docMetaSnapshotEventListener(docMetaSnapshotEvent);
                }

            };

            handleEvent()
                .catch(err => {
                    log.error(`Unable to handle synchronizing snapshot ${snapshotID}`, err);
                    errorListener(err);
                });

        }, this.docMetaComparisonIndex);

        const synchronizingListener = synchronizingEventDeduplicator.listener;

        log.info("Local snapshot...");
        const localSnapshotResultPromise = localInitialSnapshotLatch.createSnapshot(this.local);
        await localInitialSnapshotLatch.latch.get();
        log.info("Local snapshot...done");

        log.info("Cloud snapshot...");
        const cloudSnapshotResultPromise = cloudInitialSnapshotLatch.createSnapshot(this.cloud);
        await cloudInitialSnapshotLatch.latch.get();
        log.info("Cloud snapshot...done");

        const localSyncOrigin: SyncOrigin = {
            datastore: this.local,
            syncDocMap: localInitialSnapshotLatch.syncDocMap
        };

        const cloudSyncOrigin: SyncOrigin = {
            datastore: this.cloud,
            syncDocMap: cloudInitialSnapshotLatch.syncDocMap
        };

        if (isPrimarySnapshot) {

            await PersistenceLayers.synchronizeOrigins(localSyncOrigin, cloudSyncOrigin, deduplicatedListener.listener);

        }

        initialSyncCompleted = true;

        await localSnapshotResultPromise;
        const cloudSnapshotResult = await cloudSnapshotResultPromise;

        log.notice("INITIAL SNAPSHOT COMPLETE");

        return {
            unsubscribe: cloudSnapshotResult.unsubscribe
        };

    }

    private async handleSnapshotSynchronization(docMetaSnapshotEvent: DocMetaSnapshotEvent, listener: DocMetaSnapshotEventListener) {

        const toLocalSyncOrigin = async (): Promise<SyncOrigin> => {

            // TODO: we should have progress on this...

            const docaMetaFiles: DocMetaRef[] =
                docMetaSnapshotEvent.docMetaMutations.map(current => {
                    return {fingerprint: current.fingerprint};
                });

            const syncDocMap = await PersistenceLayers.toSyncDocMapFromDocs(this.local, docaMetaFiles);

            return {
                datastore: this.local,
                syncDocMap
            };

        };

        const toCloudSyncOrigin = async (): Promise<SyncOrigin> => {

            const syncDocs = await DocMetaSnapshotEvents.toSyncDocs(docMetaSnapshotEvent);

            return {
                datastore: this.cloud,
                syncDocMap: SyncDocMaps.fromArray(syncDocs)
            };

        };

        if (docMetaSnapshotEvent.consistency !== 'committed') {
            return;
        }

        for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {

            if (docMetaMutation.mutationType === 'created' || docMetaMutation.mutationType === 'updated') {

                const cloudSyncOrigin = await toCloudSyncOrigin();
                const localSyncOrigin = await toLocalSyncOrigin();

                log.info("Transferring from cloud -> local...");
                await PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, listener, 'cloud-to-local');
                log.info("Transferring from cloud -> local...done");

            }

            if (docMetaMutation.mutationType === 'deleted') {
                // TODO: how do we handle this via transfer the function...
                // we're also not receiving events for this in the UI so no
                // progress updates.
                const docMetaFileRef = await docMetaMutation.docMetaFileRefProvider();

                // We have to handle deleting the binary files locally...
                const fileRefs = BackendFileRefs.toBackendFileRefs(Either.ofRight(docMetaFileRef.docInfo));

                for (const fileRef of fileRefs) {
                    // TODO: do this in parallel...
                    await this.local.deleteFile(fileRef.backend, fileRef);
                }

                // TODO: do both the main delete and each file delete in
                // parallel.

                await this.local.delete(docMetaFileRef);
                log.info("File deleted: " , docMetaFileRef);
            }

        }

        this.synchronizationEventDispatcher.dispatchEvent({
            ...docMetaSnapshotEvent,
            dest: 'local'
        });

    }

    public addFileSynchronizationEventListener(eventListener: FileSynchronizationEventListener): void {
        this.fileSynchronizationEventDispatcher.addEventListener(eventListener);
    }

    public addSynchronizationEventListener(eventListener: SynchronizationEventListener): void {
        this.synchronizationEventDispatcher.addEventListener(eventListener);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }

    public async deactivate() {
        await firebase.auth().signOut();
    }

    public async overview(): Promise<DatastoreOverview | undefined> {

        return Optional.first(await this.local.overview(),
                              await this.cloud.overview()).getOrUndefined();
    }

    public capabilities(): DatastoreCapabilities {

        // we support both 'local' and 'web' here since this is a combination
        // of both firebase and the disk datastore.
        const networkLayers = new Set<NetworkLayer>(['local', 'web']);

        return {
            networkLayers,
            permission: {mode: 'rw'}
        };

    }

    public getPrefs(): PrefsProvider {
        return this.local.getPrefs();
    }

}


/**
 * Represents a doc and its UUID.  The UUID is optional though as older docs
 * may not have a doc but in practice almost all docs will have a UUID.
 */
export interface DocUUID {
    fingerprint: string;
    uuid?: UUID;
}

export type CloudDatastoreID = 'local' | 'cloud';

