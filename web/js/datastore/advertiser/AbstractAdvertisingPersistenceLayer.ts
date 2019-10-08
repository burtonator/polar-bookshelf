import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {PersistenceLayerListener} from '../PersistenceLayerListener';
import {PersistenceLayer, PersistenceLayerID} from '../PersistenceLayer';
import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {BinaryFileData, Datastore, DeleteResult, DocMetaSnapshotEventListener, ErrorListener, SnapshotResult} from '../Datastore';
import {WriteFileOpts} from '../Datastore';
import {GetFileOpts} from '../Datastore';
import {DatastoreOverview} from '../Datastore';
import {DatastoreCapabilities} from '../Datastore';
import {DatastoreInitOpts} from '../Datastore';
import {PersistenceEventType} from '../PersistenceEventType';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from '../DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocInfo} from '../../metadata/DocInfo';
import {DatastoreMutation} from '../DatastoreMutation';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Releaseable} from '../../reactor/EventListener';
import {WriteOpts} from '../PersistenceLayer';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";

export abstract class AbstractAdvertisingPersistenceLayer implements ListenablePersistenceLayer {

    public abstract readonly id: PersistenceLayerID;

    public readonly datastore: Datastore;

    protected readonly reactor = new SimpleReactor<PersistenceLayerEvent>();

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    public readonly delegate: PersistenceLayer;

    protected constructor(delegate: PersistenceLayer) {
        this.datastore = delegate.datastore;
        this.delegate = delegate;
    }

    public init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<void> {
        return this.delegate.init(errorListener, opts);
    }

    public stop(): Promise<void> {
        return this.delegate.stop();
    }

    public addEventListener(listener: PersistenceLayerListener): Releaseable {
        return this.reactor.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {

        this.addEventListener((event) => {

            if (fingerprint === event.docInfo.fingerprint) {
                listener(event);
            }

        });

    }

    public async writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo> {

        return await this.handleWrite(docMeta, async () => await this.delegate.writeDocMeta(docMeta, datastoreMutation));

    }

    public async write(fingerprint: string,
                       docMeta: IDocMeta,
                       opts?: WriteOpts): Promise<IDocInfo> {

        return await this.handleWrite(docMeta, async () => await this.delegate.write(fingerprint, docMeta, opts));

    }

    private async handleWrite(docMeta: IDocMeta, handler: () => Promise<IDocInfo>) {

        const docInfo = await handler();

        const eventType: PersistenceEventType
            = this.contains(docMeta.docInfo.fingerprint) ? 'updated' : 'created';

        this.broadcastEvent({
            docInfo,
            docMetaRef: {
                fingerprint: docMeta.docInfo.fingerprint
            },
            eventType
        });

        return docInfo;

    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.delegate.synchronizeDocs(...docMetaRefs);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaRefs();
    }

    public snapshot(listener: DocMetaSnapshotEventListener,
                    errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        return this.delegate.snapshot(listener, errorListener);

    }

    public async createBackup(): Promise<void> {
        return this.delegate.createBackup();
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult> {

        const result = this.delegate.delete(docMetaFileRef);

        this.broadcastEvent({
            docInfo: docMetaFileRef.docInfo,
            docMetaRef: {
                fingerprint: docMetaFileRef.fingerprint
            },
            eventType: 'deleted'
        });

        return result;
    }

    public async getDocMeta(fingerprint: string): Promise<IDocMeta| undefined> {
        return await this.delegate.getDocMeta(fingerprint);
    }

    /**
     * Dispatch an event to all listeners. This is different from notify in that
     * this just dispatches to the local reactor.
     */
    public dispatchEvent(event: PersistenceLayerEvent) {
        this.reactor.dispatchEvent(event);
    }

    public writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        return this.delegate.writeFile(backend, ref, data, opts);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        return this.datastore.deleteFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        return this.delegate.getFile(backend, ref, opts);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    protected abstract broadcastEvent(event: PersistenceLayerEvent): void;

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public capabilities(): DatastoreCapabilities {
        return this.delegate.capabilities();
    }

    public async deactivate() {
        await this.delegate.deactivate();
    }

}

