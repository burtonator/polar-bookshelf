/**
 * Datastore just in memory with no on disk persistence.
 */
import {AbstractDatastore, Datastore, DeleteResult, DocMetaSnapshotEventListener, ErrorListener, FileMeta, SnapshotResult, DatastoreOverview, PrefsProvider} from './Datastore';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FileHandle, Files} from 'polar-shared/src/util/Files';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DiskInitResult} from './DiskDatastore';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {DictionaryPrefs} from '../util/prefs/Prefs';
import {Providers} from 'polar-shared/src/util/Providers';
import {WriteFileOpts} from './Datastore';
import {DefaultWriteFileOpts} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {NetworkLayer} from './Datastore';
import {WriteOpts} from './Datastore';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

export class MemoryDatastore extends AbstractDatastore implements Datastore {

    public readonly id = 'memory';

    private readonly created: ISODateTimeString;

    protected readonly docMetas: {[fingerprint: string]: string} = {};

    protected readonly files: {[key: string]: FileData} = {};

    private readonly prefs = new DictionaryPrefs();

    constructor() {
        super();

        this.docMetas = {};
        this.created = ISODateTimeStrings.create();

    }

    // noinspection TsLint
    public async init(errorListener: ErrorListener = NULL_FUNCTION): Promise<DiskInitResult> {
        return {};
    }

    public async stop() {
        // noop
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return fingerprint in this.docMetas;
    }

    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        const result: any = {
            docMetaFile: {
                path: `/${docMetaFileRef.fingerprint}.json`,
                deleted: false
            },
            dataFile: {
                path: '/' + Optional.of(docMetaFileRef.docFile)
                                .map(current => current.name)
                                .getOrUndefined(),
                deleted: false
            }
        };

        if (await this.contains(docMetaFileRef.fingerprint)) {
            result.docMetaFile.deleted = true;
            result.dataFile.deleted = true;
        }

        return result;

    }

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: FileHandle | Buffer | string,
                           opts: WriteFileOpts = new DefaultWriteFileOpts()): Promise<DocFileMeta> {

        const key = MemoryDatastore.toFileRefKey(backend, ref);

        let buff: Buffer | undefined;

        if (typeof data === 'string') {
            buff = Buffer.from(data);
        } else if (data instanceof Buffer) {
            buff = data;
        } else {
            buff = await Files.readFileAsync(data.path);
        }

        const meta = opts.meta || {};

        this.files[key] = {buffer: buff!, meta};

        return {backend, ref, url: 'NOT_IMPLEMENTED:none'};

    }

    public getFile(backend: Backend, ref: FileRef): DocFileMeta {

        const key = MemoryDatastore.toFileRefKey(backend, ref);

        if (!key) {
            throw new Error(`No file for ${backend} at ${ref.name}`);
        }

        const fileData = this.files[key];

        return {backend, ref, url: 'NOT_IMPLEMENTED:none'};

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        const key = MemoryDatastore.toFileRefKey(backend, ref);
        return isPresent(this.files[key]);
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        const key = MemoryDatastore.toFileRefKey(backend, ref);
        delete this.files[key];
    }

    /**
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const nrDocs = Object.keys(this.docMetas).length;

        log.info(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`);

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       data: string,
                       docInfo: IDocInfo,
                       opts: WriteOpts = {}): Promise<void> {

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        Preconditions.assertTypeOf(data, "string", "data");

        this.docMetas[fingerprint] = data;

        datastoreMutation.written.resolve(true);
        datastoreMutation.committed.resolve(true);

    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {

        return Object.keys(this.docMetas)
            .map(fingerprint => <DocMetaRef> {fingerprint});

    }

    public async snapshot(listener: DocMetaSnapshotEventListener): Promise<SnapshotResult> {

        return Datastores.createCommittedSnapshot(this, listener);

    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        // noop now
    }

    public async overview(): Promise<DatastoreOverview> {

        const docMetaRefs = await this.getDocMetaRefs();

        return {nrDocs: docMetaRefs.length, created: this.created};

    }

    public capabilities(): DatastoreCapabilities {

        const networkLayers = new Set<NetworkLayer>(['local']);

        return {
            networkLayers,
            permission: {mode: 'rw'}
        };

    }

    private static toFileRefKey(backend: Backend, fileRef: FileRef) {
        return `${backend}:${fileRef.name}`;
    }

    public getPrefs(): PrefsProvider {
        return Providers.toInterface(() => this.prefs);
    }

}

interface FileData {
    buffer: Buffer;
    meta: FileMeta;
}
