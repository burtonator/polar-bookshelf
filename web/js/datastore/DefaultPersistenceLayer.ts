import {BinaryFileData, Datastore, DeleteResult, DocMetaSnapshotEventListener, ErrorListener, SnapshotResult} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {DatastoreOverview} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {PersistenceLayer} from './PersistenceLayer';
import {WriteOpts} from './PersistenceLayer';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreMutations} from './DatastoreMutations';
import {UUIDs} from '../metadata/UUIDs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

/**
 * First layer before the raw datastore. At one point we allowed the datastore
 * to perform all the data manipulation / serialization but we ran into problems
 * with node+chrome behaving differently so now we just make node work with raw
 * strings.
 */
export class DefaultPersistenceLayer implements PersistenceLayer {

    public readonly id = 'default';

    public readonly datastore: Datastore;

    private datastoreMutations: DatastoreMutations;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
        this.datastoreMutations = DatastoreMutations.create('written');
    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION, opts?: DatastoreInitOpts) {
        await this.datastore.init(errorListener, opts);
    }

    public async stop() {
        await this.datastore.stop();
    }

    public contains(fingerprint: string): Promise<boolean> {
        return this.datastore.contains(fingerprint);
    }

    public delete(docMetaFileRef: DocMetaFileRef,
                  datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<DeleteResult> {

        return this.datastore.delete(docMetaFileRef, datastoreMutation);

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<IDocMeta | undefined> {

        const data = await this.datastore.getDocMeta(fingerprint);

        if (!isPresent(data)) {
            return undefined;
        }

        if (! (typeof data === "string")) {
            throw new Error("Expected string and received: " + typeof data);
        }

        const docMeta = DocMetas.deserialize(data, fingerprint);

        return docMeta;

    }

    /**
     * Convenience method to not require the fingerprint.
     */
    public async writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo> {

        Preconditions.assertPresent(docMeta, "No docMeta");
        Preconditions.assertPresent(docMeta.docInfo, "No docInfo on docMeta");
        Preconditions.assertPresent(docMeta.docInfo.fingerprint, "No fingerprint on docInfo");

        return this.write(docMeta.docInfo.fingerprint, docMeta, {datastoreMutation});

    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       docMeta: IDocMeta,
                       opts: WriteOpts = {}): Promise<IDocInfo> {

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        Preconditions.assertPresent(fingerprint, "fingerprint");
        Preconditions.assertPresent(docMeta, "docMeta");

        if (! (docMeta instanceof DocMeta)) {
            // check to make sure nothing from JS-land can call this
            // incorrectly.
            throw new Error("Can not sync anything other than DocMeta.");
        }

        // create a copy of docMeta so we can mutate it without the risk of
        // firing event listeners via proxies and then we can update the
        // lastUpdated time.  We're also going to have to fire and advertisement
        // that it's been updated.

        docMeta = Dictionaries.copyOf(docMeta);

        // now update the lastUpdated times before we commit to disk.
        docMeta.docInfo.lastUpdated = ISODateTimeStrings.create();

        docMeta.docInfo.nrComments = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.comments))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrNotes = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.notes))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrFlashcards = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.flashcards))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrTextHighlights = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.textHighlights))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrAreaHighlights = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.areaHighlights))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrAnnotations =
            docMeta.docInfo.nrComments +
            docMeta.docInfo.nrNotes +
            docMeta.docInfo.nrFlashcards +
            docMeta.docInfo.nrTextHighlights +
            docMeta.docInfo.nrAreaHighlights;

        if (docMeta.docInfo.added === undefined) {
            docMeta.docInfo.added = ISODateTimeStrings.create();
        }

        // update the sequence before we write it out to disk.
        docMeta.docInfo.uuid = UUIDs.create();

        log.info(`Sync of docMeta with fingerprint: ${fingerprint} and UUID: ` + docMeta.docInfo.uuid);

        // NOTE that we always write the state with JSON pretty printing.
        // Otherwise tools like git diff , etc will be impossible to deal with
        // in practice.
        const data = DocMetas.serialize(docMeta, "");

        const docInfo = Object.assign({}, docMeta.docInfo);

        const syncMutation = new DefaultDatastoreMutation<boolean>();

        DatastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);

        const writeOpts = {
            ...opts,
            datastoreMutation: syncMutation,
        };

        await this.datastore.write(fingerprint, data, docInfo, writeOpts);

        return docInfo;

    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.datastore.synchronizeDocs(...docMetaRefs);
    }

    public getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.datastore.getDocMetaRefs();
    }

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    public snapshot(listener: DocMetaSnapshotEventListener,
                    errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {
        return this.datastore.snapshot(listener, errorListener);
    }

    public async createBackup(): Promise<void> {
        return this.datastore.createBackup();
    }

    public writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        return this.datastore.writeFile(backend, ref, data, opts);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.datastore.containsFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        return this.datastore.getFile(backend, ref, opts);
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        return this.datastore.deleteFile(backend, ref);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.datastore.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.datastore.overview();
    }

    public capabilities(): DatastoreCapabilities {
        return this.datastore.capabilities();
    }

    public async deactivate() {
        await this.datastore.deactivate();
    }

}

