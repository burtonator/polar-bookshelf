import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {
    BackendFileRefData,
    BinaryFileData,
    Datastore,
    DatastoreCapabilities, DatastoreConsistency,
    DatastoreInitOpts,
    DatastoreOverview,
    DeleteResult,
    DocMetaSnapshot,
    DocMetaSnapshotEventListener,
    DocMetaSnapshotOpts,
    DocMetaSnapshotResult,
    ErrorListener,
    GroupIDStr,
    SnapshotResult,
    WriteFileOpts, WriteFileProgressListener, WriteOptsBase
} from './Datastore';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {DatastoreMutation} from './DatastoreMutation';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {ListenablePersistenceLayer} from "./ListenablePersistenceLayer";
import {UserTagsDB} from "./UserTagsDB";
import {DocMetas} from "../metadata/DocMetas";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";

export interface PersistenceLayer {

    readonly id: PersistenceLayerID;

    /**
     * The underlying datastore backing this persistence layer.
     */
    readonly datastore: Datastore;

    init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<void>;

    stop(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    getDocMeta(fingerprint: string): Promise<IDocMeta | undefined>;

    getDocMetaSnapshot(opts: DocMetaSnapshotOpts<IDocMeta>): Promise<DocMetaSnapshotResult>;

    getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>>;

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    snapshot(listener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult>;

    createBackup(): Promise<void>;

    /**
     * Delete a file from PersistenceLayer.
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult>;

    writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo>;

    /**
     * Make sure the docs with the given fingerprints are synchronized with
     * this datastore. Only implemented in cloud datastores.
     */
    synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void>;

    /**
     * Return the DocInfo written. The DocInfo may be updated on commit
     * including updating lastUpdated, etc.
     */
    write(fingerprint: string, docMeta: IDocMeta, opts?: WriteOpts): Promise<IDocInfo>;

    writeFile(backend: Backend,
              ref: FileRef,
              data: BinaryFileData,
              opts?: WriteFileOpts): Promise<DocFileMeta>;

    getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta;

    containsFile(backend: Backend, ref: FileRef): Promise<boolean>;

    deleteFile(backend: Backend, ref: FileRef): Promise<void>;

    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void;

    deactivate(): Promise<void>;

    overview(): Promise<DatastoreOverview  | undefined>;

    capabilities(): DatastoreCapabilities;

    getUserTagsDB(): Promise<UserTagsDB>;

}

export abstract class AbstractPersistenceLayer {

    public readonly abstract datastore: Datastore;

    public async getDocMetaSnapshot(opts: DocMetaSnapshotOpts<IDocMeta>): Promise<DocMetaSnapshotResult> {

        const onSnapshot = (snapshot: DocMetaSnapshot<string>) => {

            if (snapshot.data) {
                const docMeta = DocMetas.deserialize(snapshot.data, opts.fingerprint);

                opts.onSnapshot({...snapshot, data: docMeta});

            } else {
                opts.onSnapshot({...snapshot, data: undefined});
            }

        };

        return await this.datastore.getDocMetaSnapshot({
            fingerprint: opts.fingerprint,
            onSnapshot: snapshot => onSnapshot(snapshot),
            onError: opts.onError
        });

    }

}

export interface WriteOpts extends WriteOptsBase<IDocInfo> {


}

export type PersistenceLayerID = string;

export type PersistenceLayerProvider = () => PersistenceLayer;

export type ListenablePersistenceLayerProvider = () => ListenablePersistenceLayer;

