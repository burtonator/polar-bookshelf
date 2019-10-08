// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {FileHandle} from 'polar-shared/src/util/Files';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {Progress} from '../util/ProgressTracker';
import {AsyncProvider} from 'polar-shared/src/util/Providers';
import {UUID} from 'polar-shared/src/metadata/UUID';
import {AsyncWorkQueues} from '../util/AsyncWorkQueues';
import {DocMetas} from '../metadata/DocMetas';
import {DatastoreMutations} from './DatastoreMutations';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Prefs} from '../util/prefs/Prefs';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Either} from '../util/Either';
import {BackendFileRefs} from './BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";

export interface Datastore extends BinaryDatastore, WritableDatastore {

    /**
     * The id of this datastore.
     */
    readonly id: DatastoreID;

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<InitResult>;

    stop(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    /**
     * Get the data for the DocMeta object we currently in the datastore for
     * this given fingerprint or null if it does not exist.
     * @return {string} A JSON string representing the DocMeta which is decoded
     * by the PersistenceLayer.
     */
    getDocMeta(fingerprint: string): Promise<string | null>;

    /**
     * Return an array of {DocMetaRef}s currently in the repository.
     */
    getDocMetaRefs(): Promise<DocMetaRef[]>;

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
             errorListener?: ErrorListener): Promise<SnapshotResult>;

    /**
     * An event listener to listen to the datastore while operating on both
     * the underlying datastores to discover when documents are discovered
     * without having to re-read the datastore after it's been initialized.
     */
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void;

    /**
     * Deactivate using this datastore. For most datastores this is not used
     * but for cloud sources this would logout and perform other tasks.
     */
    deactivate(): Promise<void>;

    /**
     * Get an overview of the datastore including the time it was created as
     * well as other stats including the number of docs.
     */
    overview(): Promise<DatastoreOverview | undefined>;

    /**
     * Get a Prefs object that supports reading and writing key/values to a
     * simple prefs store.
     */
    getPrefs(): PrefsProvider;

    capabilities(): DatastoreCapabilities;

}

// writable, readonly , ro vs rw... readonly is better BUT that's reserved by
// typescript

export type Mode = 'rw' | 'ro';

export interface DatastorePermission {

    /**
     * The high level permissions mode for this datastore. Applied to ALL
     * access to the store not on a file by file basis.
     */
    readonly mode: Mode;

}

export interface DatastoreCapabilities {

    /**
     * Provides callers with the available network layers for this datastore.
     */
    readonly networkLayers: ReadonlySet<NetworkLayer>;

    readonly permission: DatastorePermission;

}

export interface DatastoreInfo {

    /**
     * The time the datastore was created.
     */
    readonly created: ISODateTimeString;

}

export interface DatastoreOverview {

    /**
     * The time the datastore was created.  Right now we don't always know
     * when the datastore was created due to adding this feature later (storing
     * the creation time) later.
     */
    readonly created?: ISODateTimeString;

    /**
     * The number of documents in the datastore.
     */
    readonly nrDocs: number;

}

export abstract class AbstractDatastore {

    protected datastoreMutations: DatastoreMutations;

    protected constructor() {
        this.datastoreMutations = DatastoreMutations.create('written');

    }

    public async writeDocMeta(docMeta: IDocMeta,
                              datastoreMutation: DatastoreMutation<IDocInfo> = new DefaultDatastoreMutation()): Promise<IDocInfo> {

        const data = DocMetas.serialize(docMeta, "");
        const docInfo = docMeta.docInfo;

        const syncMutation = new DefaultDatastoreMutation<boolean>();
        DatastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);

        await this.write(docMeta.docInfo.fingerprint, data, docInfo, {datastoreMutation: syncMutation});
        return docInfo;

    }

    public abstract writeFile(backend: Backend,
                              ref: FileRef,
                              data: BinaryFileData,
                              opts?: WriteFileOpts): Promise<DocFileMeta>;

    /**
     * Handle the file write if specify as a dependency within write()
     */
    protected async handleWriteFile(opts?: WriteOpts) {

        if (! opts) {
            return;
        }

        if (opts.writeFile) {
            await this.writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data);
        }

    }

    public abstract write(fingerprint: string,
                          data: any,
                          docInfo: IDocInfo,
                          opts?: WriteOpts): Promise<void>;

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        // noop
    }

    public async deactivate() {
        // noop
    }

    public async createBackup(): Promise<void> {

        // only supported with the disk datastore.
        // TODO (webapp) I think this needs to be enabled for Firebase?
        // throw new Error("Not supported with this datatore");

    }

}

export interface WriteOpts {

    readonly datastoreMutation?: DatastoreMutation<boolean>;

    /**
     * Also write a file (PDF, PHZ) with the DocMeta data so that it's atomic
     * and that the operations are ordered properly.
     */
    readonly writeFile?: BackendFileRefData;

    readonly visibility?: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr>;

}

interface WritableDatastore {

    /**
     * Delete the DocMeta file and the underlying doc from the stash.  Deletes
     * MUST be idempotent.
     *
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>>;

    writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo>;

    /**
     * Write the datastore to disk.  Writes should be idempotent.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     * @param docInfo The DocInfo for this document that we're writing
     * @param opts The opts to use when writing the file.
     */
    write(fingerprint: string,
          data: string,
          docInfo: IDocInfo,
          opts?: WriteOpts): Promise<void>;

    /**
     * Make sure the docs with the given fingerprints are synchronized with
     * this datastore. Only implemented in cloud datastores.
     */
    synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void>;

    createBackup(): Promise<void>;

}

/**
 * A datastore that support storage of binary data (images, videos, PDFs, etc).
 */
export interface BinaryDatastore extends ReadableBinaryDatastore, WritableBinaryDatastore {

}

export interface ReadableBinaryDatastore {

    containsFile(backend: Backend, ref: FileRef): Promise<boolean>;

    getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta;

}

/**
 * Options for getFile
 */
export interface GetFileOpts {

    /**
     * Allows the caller to specify a more specific network layer for the
     * file operation and returning a more specific URL.
     */
    readonly networkLayer?: NetworkLayer;

}

export interface WritableBinaryDatastore {

    /**
     * Add file data to the datastore.  This is used for binary data or other
     * data types that need to be stored. This is primarily designed for video,
     * audio, and documents like PDF, ePub, etc.
     */
    writeFile(backend: Backend,
              ref: FileRef,
              data: BinaryFileData,
              opts?: WriteFileOpts): Promise<DocFileMeta>;

    deleteFile(backend: Backend, ref: FileRef): Promise<void>;

}

export interface WriteFileOpts {

    /**
     * @deprecated we no longer support arbitrary file metadata.
     */
    readonly meta?: FileMeta;

    /**
     * Set the file visibility.  Default is private.
     */
    readonly visibility?: Visibility;

    /**
     * Only update metadata.  Don't actually write data.
     */
    readonly updateMeta?: boolean;

    readonly datastoreMutation?: DatastoreMutation<boolean>;

}

export class DefaultWriteFileOpts implements WriteFileOpts {
    public readonly meta: FileMeta = {};
    public readonly visibility = Visibility.PRIVATE;
}

export interface WritableBinaryMetaDatastore {
    // writeFileMeta(backend: Backend, ref: FileRef, docFileMeta: DocFileMeta): Promise<void>;
}

export type BinaryFileData = FileHandle | Buffer | string | Blob | NodeJS.ReadableStream;

export function isBinaryFileData(data: any): boolean {

    if (! isPresent(data)) {
        return false;
    }

    if (typeof data === 'string') {
        return true;
    }

    if (data instanceof Buffer) {
        return true;
    }

    if (data instanceof Blob) {
        return true;
    }

    if (isPresent(data.path)) {
        // if it seems like a FileHandle then use it as it will be supported
        return true;
    }

    return false;

}

export interface BackendFileRefData extends BackendFileRef {
    readonly data: BinaryFileData;
}

// noinspection TsLint
/**
 * Arbitrary settings for files specific to each storage layer.  Firebase uses
 * visibility and uid.
 */
export interface FileMeta {

    // TODO: I should also include the StorageSettings from Firebase here to
    // give it a set of standardized fields like contentType as screenshots
    // needs to be added with a file type.
    [key: string]: string;

}

/**
 *
 * A datastore that provides events about changes being made to the datastore.
 *
 * This includes the granularity we need for replicating the data to a local
 * datastore by fetching the data and writing it back out on the mutation.
 */
export interface SynchronizingDatastore extends Datastore {

    /**
     * Listens for mutations to binaries.
     */
    addFileSynchronizationEventListener(fileSynchronizationEventListener: FileSynchronizationEventListener): void;

    /**
     * Listens only for new synchronized documents and ignores existing
     * documents.  This allows us to find replicated documents as they
     * change.
     */
    addSynchronizationEventListener(synchronizationEventListener: SynchronizationEventListener): void;

    // /**
    //  * Mark that we've properly transferred the disk datastore into the cloud
    //  * datastore and now the cloud datastore is the primary source.
    //  *
    //  */
    // markMerged(transferred: boolean): Promise<void>;

}

export interface SynchronizationEvent extends DocMetaSnapshotEvent {

    /**
     * The destination of the data in this synchronization event.  When the
     * dest is 'local' we're copying from the cloud to local and when it's
     * 'cloud' then we're copying from the local to the cloud.
     */
    readonly dest: DatastoreID;

}

export type SynchronizationEventListener = (synchronizationEvent: SynchronizationEvent) => void;

/**
 * Mutations on binary files.
 */
export interface FileSynchronizationEvent {

    readonly backend: Backend;

    readonly name: string;

    readonly mutationType: MutationType;

}

export type FileSynchronizationEventListener = (fileSynchronizationEvent: FileSynchronizationEvent) => void;

/**
 * Call the listener for every DocMetaSnapshotEvent and await its results.  It's
 * VERY important to await the results here!
 */
export type DocMetaSnapshotEventListener = (docMetaSnapshotEvent: DocMetaSnapshotEvent) => Promise<void>;

export type ErrorListener = (err: Error) => void;

/**
 * A DocMetaSnapshotEvent is a snapshot of the Datastore based on the current
 * state as well as future snapshots as the remote store changes.  This includes
 * DocMeta mutations which also include a MutationType for whether the document
 * was created, updated, or deleted.
 *
 * Note that a snapshot event can have zero or more docMetaMutations.  We will
 * generate zero DocMetaMutations when we're updating progress.
 */
export interface DocMetaSnapshotEvent {

    readonly datastore: DatastoreID;

    readonly progress: Readonly<SnapshotProgress>;

    readonly consistency: DatastoreConsistency;

    /**
     * An array of mutations that have been applied.  We return as an array to
     * enable performance updates via batching.
     */
    readonly docMetaMutations: ReadonlyArray<DocMetaMutation>;

    readonly batch?: DocMetaSnapshotBatch;

}

export class DocMetaSnapshotEvents {

    public static format(ev: DocMetaSnapshotEvent) {

        let batch = "NO BATCH";

        if (ev.batch) {
            batch = `(id: ${ev.batch!.id}, terminated: ${ev.batch!.terminated})`;
        }

        const progress = ev.progress.progress;
        const nrMutations = ev.docMetaMutations.length;

        return `${ev.datastore} ${progress}% (consistency: ${ev.consistency}, nr mutations: ${nrMutations}, batch: ${batch})`;

    }

    public static async toDocInfos(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<IDocInfo>> {

        return AsyncWorkQueues
            .awaitAsyncFunctions(docMetaSnapshotEvent.docMetaMutations.map(current => current.docInfoProvider));

    }

    public static async toSyncDocs(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<SyncDoc>> {

        const typedAsyncFunctions = docMetaSnapshotEvent.docMetaMutations.map(docMetaMutation => {
            return async () => {
                const docInfo = await docMetaMutation.docInfoProvider();
                return SyncDocs.fromDocInfo(docInfo, docMetaMutation.mutationType);
            };
        });

        return await AsyncWorkQueues.awaitAsyncFunctions(typedAsyncFunctions);

    }

}

/**
 * Represents data around a specific batch of DocMetaMutations so that we know
 * when we have a first consistent snapshot.  This way we can get streaming
 * events but know when part of the stream has terminated.
 *
 * The batch is only present (usually) on first level datastores not aggregate
 * datastores which might be merging streams.
 */
export interface DocMetaSnapshotBatch {

    /**
     * The ID of this batch. The first batch at a given consistency level is a
     * complete snapshot of the underlying datastore and all docs.  You MAY not
     * receive a batch with consistency 'written' and only receive one for
     * 'committed' so you should focus on committed. Batches after the first are
     * differential and only represent updates.
     */
    readonly id: number;

    /**
     * True if we've received all the events in this batch and this is the last
     * event you will see with the same batch ID.
     */
    readonly terminated: boolean;

}

/**
 * The consistency of the underlying data, whether it's written or committed.
 *
 * 'written' means that it was written to a WAL or a local cache but may not
 * be fully committed to a cloud store, to all replicas of a database, etc.
 *
 * 'committed' means that it's fully commited and consistent with the current
 * state of a database system.  A read that is 'committed' means it is fully
 * up to date.
 *
 */
export type DatastoreConsistency = 'written' | 'committed';

export interface SnapshotProgress extends Readonly<Progress> {

}

/**
 * Only use one provider, either dataProvider, docMetaProvider, or
 * docInfoProvider, whichever is the most efficient and only read once ideally.
 */
export interface DocMetaMutation {

    readonly fingerprint: string;

    readonly mutationType: MutationType;

    readonly docMetaFileRefProvider: AsyncProvider<DocMetaFileRef>;

    /**
     * Get access to the underlying data of the DocMeta to enable us to
     * read/write directly to the Datastore without mutating anything.
     */
    readonly dataProvider: AsyncProvider<string | null>;

    readonly docMetaProvider: AsyncProvider<IDocMeta>;

    readonly docInfoProvider: AsyncProvider<IDocInfo>;

}

export type MutationType = 'created' | 'updated' |'deleted';

/**
 * The result of an init operation which could be different form each datastore.
 */
export interface InitResult {

}


/**
 * The result of a delete() operation.
 */
export interface DeleteResult {

}

/**
 * Listens to documents in the local repository on load.  We receive one event
 * per document it enters the repository. Once on startup if it's already
 * present and then again if it's replicated from the cloud.
 */
export type InitDocMetaEventListener = (initDocMetaEvent: InitDocMetaEvent) => void;

export interface InitDocMetaEvent {
    readonly docMeta: IDocMeta;
}

/**
 * If the `init` method is given an InitLoadListener the init function gives the
 * caller a copy of every DocMeta in the datastore on init.  This can be help
 * full in general to load a UI or data into memory but since internally the
 * datastore might ALSO be loading the docMeta for internal operations
 * (consistency, snapshots, etc) then we can surface this data to the user
 * without doing a double init.
 */
export type InitLoadListener = (docMeta: IDocMeta) => void;

/**
 * The result of a snapshot call with an optional unsubscribe callback.
 */
export interface SnapshotResult {

    /**
     * An optional unsubscribe
     */
    readonly unsubscribe?: SnapshotUnsubscriber;

}

/**
 * A function for unsubscribing to future snapshot events.
 */
export type SnapshotUnsubscriber = () => void;

export interface SyncDocMap {
    [fingerprint: string]: SyncDoc;

}

export class SyncDocMaps {

    public static putAll(syncDocMap: SyncDocMap, syncDocs: ReadonlyArray<SyncDoc>): void {

        for (const syncDoc of syncDocs) {
            syncDocMap[syncDoc.fingerprint] = syncDoc;
        }

    }

    public static fromArray(syncDocs: ReadonlyArray<SyncDoc>): SyncDocMap {

        const result: SyncDocMap = {};

        for (const syncDoc of syncDocs) {
            result[syncDoc.fingerprint] = syncDoc;
        }

        return result;

    }

}

/**
 * A lightweight doc reference to sync between two datasources.  A SyncDoc is a
 * flighweight and should be kept minimally compact to save space.
 */
export interface SyncDoc {

    readonly fingerprint: string;

    readonly mutationType: MutationType;

    /**
     * While the UUID is optional in practice it's required and all docs should
     * have a UUID.
     */
    readonly uuid?: UUID;

    /**
     * The title of the doc from the DocInfo for debug purposes.
     */
    readonly title: string;

    /**
     * The binary files reference by this doc.
     */
    readonly files: ReadonlyArray<SyncFile>;

    readonly docMetaFileRef: DocMetaFileRef;
}

/**
 * A lightweight reference to a binary file attached to a SyncDoc.
 */
export interface SyncFile extends BackendFileRef {

}

export class SyncDocs {

    public static fromDocInfo(docInfo: IDocInfo, mutationType: MutationType): SyncDoc {

        const files = BackendFileRefs.toBackendFileRefs(Either.ofRight(docInfo));

        return {
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || 'untitled',
            docMetaFileRef: DocMetaFileRefs.createFromDocInfo(docInfo),
            mutationType,
            uuid: docInfo.uuid,
            files
        };

    }

}

export type DatastoreID = string;


export interface DatastoreInitOpts {

    readonly noInitialSnapshot?: boolean;

    /**
     * Disable sync and just start the datastore as a client for read/write.
     */
    readonly noSync?: boolean;

}

export interface PrefsProvider {

    /**
     * Get the latest copy of the prefs we're using.
     */
    get(): Prefs;

}

export type GroupIDStr = string;

/**
 *
 *
 * The network layer specifies the access to a resource based on the network
 * type.  By default each datastore figures out the ideal network layer to
 * return file references from but based on the capabilities the caller
 * can specify a specific layer.
 *
 * The following types are supported:
 *
 * local: Access via the local disk.
 *    - pros:
 *      - VERY fast
 *    - cons:
 *      - Not sharable with others
 *
 * web: Access is available via the public web.
 *    - pros:
 *       - sharing works
 *       - access across multiple devices
 *    - cons:
 *       - may not be usable for certain people (classified information, etC).
 *
 */
export type NetworkLayer = 'local' | 'web';

export class NetworkLayers {

    public static LOCAL = new Set<NetworkLayer>(['local']);

    public static LOCAL_AND_WEB = new Set<NetworkLayer>(['local', 'web']);

    public static WEB = new Set<NetworkLayer>(['web']);

}

