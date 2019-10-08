import {AbstractDatastore, Datastore, DatastoreID} from './Datastore';
import {WritableBinaryMetaDatastore} from './Datastore';
import {DocMetaSnapshotEventListener} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {NetworkLayers} from './Datastore';
import {PrefsProvider} from './Datastore';
import {ErrorListener} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {DatastoreOverview} from './Datastore';
import {SnapshotResult} from './Datastore';
import {InitResult} from './Datastore';
import {DeleteResult} from './Datastore';
import {GetFileOpts} from './Datastore';
import {BinaryFileData} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {WriteOpts} from './Datastore';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {DocMetaFileRef} from './DocMetaRef';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {FirebaseDatastore} from './FirebaseDatastore';
import {FirebaseDocMetaID} from './FirebaseDatastore';
import {DocMetas} from '../metadata/DocMetas';
import {DocMeta} from '../metadata/DocMeta';
import {BackendFileRefs} from './BackendFileRefs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

export class SharingDatastore extends AbstractDatastore implements Datastore, WritableBinaryMetaDatastore {

    public readonly id: DatastoreID;

    private readonly delegate = new FirebaseDatastore();

    private docMetaData: string | null = null;
    private docMeta: IDocMeta | undefined;
    private docMetaRefs: DocMetaRef[] = [];
    private backendFileRefs: ReadonlyArray<BackendFileRef> = [];

    public constructor(private readonly docMetaID: FirebaseDocMetaID,
                       private readonly fingerprint: string) {
        super();
        this.id = 'shared';
    }

    public async init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<InitResult> {

        try {

            opts = {...opts, noInitialSnapshot: true};

            await this.delegate.init(errorListener, opts);

            this.docMetaData = await this.delegate.getDocMetaDirectly(this.docMetaID);

            if (this.docMetaData) {

                // TODO: this results in a dual deserialize which wastes a bit
                // of time but this isn't the end of the world really.
                this.docMeta = DocMetas.deserialize(this.docMetaData!, this.fingerprint);

                this.docMetaRefs = [
                    {
                        fingerprint: this.fingerprint,
                        docMeta: this.docMeta
                    }
                ];

                this.backendFileRefs = BackendFileRefs.toBackendFileRefs(this.docMeta);

            }

            return {};

        } catch (e) {
            log.error("Unable to init datastore: ", e);
            throw e;
        }

    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        //  noop
    }

    public capabilities(): DatastoreCapabilities {

        return {
            networkLayers: NetworkLayers.WEB,
            permission: {mode: 'ro'}
        };

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.fingerprint === fingerprint;
    }

    public async deactivate(): Promise<void> {
        // noop
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.docMetaData;
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.docMetaRefs;
    }

    public getPrefs(): PrefsProvider {
        throw this.delegate.getPrefs();
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult> {
        throw new Error("Not supported");
    }

    public async stop(): Promise<void> {
        // noop
    }

    public async write(fingerprint: string,
                       data: any,
                       docInfo: IDocInfo,
                       opts: WriteOpts = {}): Promise<void> {

        throw new Error("Not supported");

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        const backendFileRef: BackendFileRef = {backend, ...ref};

        return this.backendFileRefs.filter(current => BackendFileRefs.equals(current, backendFileRef)).length > 0;

    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>> {
        throw new Error("Not supported");
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        throw new Error("Not supported");
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        throw new Error("Not implemented yet");
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        throw new Error("Not supported");
    }

}


