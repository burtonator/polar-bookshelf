import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {BinaryFileData, Datastore, DeleteResult, DocMetaSnapshotEventListener, ErrorListener, SnapshotResult} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DatastoreOverview} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {BackendFileRefData} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {GroupIDStr} from './Datastore';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";

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

    getDocMeta(fingerprint: string): Promise<IDocMeta| undefined>;

    getDocMetaRefs(): Promise<DocMetaRef[]>;

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

}

export interface WriteOpts {

    readonly datastoreMutation?: DatastoreMutation<IDocInfo>;

    /**
     * Also write a file (PDF, PHZ) with the DocMeta data so that it's atomic
     * and that the operations are ordered properly.
     */
    readonly writeFile?: BackendFileRefData;

    readonly visibility?: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr>;

}

export type PersistenceLayerID = string;

export type PersistenceLayerProvider = () => PersistenceLayer;


