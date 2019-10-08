import {BinaryFileData, Datastore, DocMetaSnapshotEventListener, ErrorListener, SnapshotResult} from './Datastore';
import {DeleteResult} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DatastoreOverview} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {PersistenceLayer, PersistenceLayerID} from './PersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {WriteOpts} from './PersistenceLayer';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";

/**
 * A PersistenceLayer that just forwards events to the given delegate.
 */
export class DelegatedPersistenceLayer implements PersistenceLayer {

    public readonly id: PersistenceLayerID = 'delegated';

    public readonly datastore: Datastore;

    private readonly delegate: PersistenceLayer;

    constructor(delegate: PersistenceLayer) {
        this.delegate = delegate;
        this.datastore = delegate.datastore;
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        return this.datastore.deleteFile(backend, ref);
    }

    public async deactivate(): Promise<void> {
        return this.delegate.deactivate();
    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult> {
        return this.delegate.delete(docMetaFileRef, datastoreMutation);
    }

    public async getDocMeta(fingerprint: string): Promise<IDocMeta| undefined> {
        return this.delegate.getDocMeta(fingerprint);
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaRefs();
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        return this.delegate.getFile(backend, ref, opts);
    }

    public async init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<void> {
        return this.delegate.init(errorListener, opts);
    }

    public async snapshot(listener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult> {
        return this.delegate.snapshot(listener, errorListener);
    }

    public async createBackup(): Promise<void> {
        return this.delegate.createBackup();
    }

    public async stop(): Promise<void> {
        return this.delegate.stop();
    }

    public async write(fingerprint: string, docMeta: IDocMeta, opts?: WriteOpts): Promise<IDocInfo> {
        return this.delegate.write(fingerprint, docMeta, opts);
    }

    public async writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo> {
        return this.delegate.writeDocMeta(docMeta, datastoreMutation);
    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.delegate.synchronizeDocs(...docMetaRefs);
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        return this.delegate.writeFile(backend, ref, data, opts);
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public capabilities(): DatastoreCapabilities {
        return this.delegate.capabilities();
    }

}
