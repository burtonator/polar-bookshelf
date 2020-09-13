import {
    PersistenceLayerProvider,
    WriteOpts
} from '../../../datastore/PersistenceLayer';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {DocMetas} from '../../../metadata/DocMetas';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {FileHandle} from 'polar-shared/src/util/Files';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DatastoreFiles} from '../../../datastore/DatastoreFiles';
import {
    HashAlgorithm,
    Hashcode,
    HashEncoding
} from 'polar-shared/src/metadata/Hashcode';
import {
    BackendFileRefData,
    BinaryFileData, DatastoreConsistency,
    WriteFileProgressListener
} from '../../../datastore/Datastore';
import {URLs} from 'polar-shared/src/util/URLs';
import {InputSources} from 'polar-shared/src/util/input/InputSources';
import {BackendFileRefs} from '../../../datastore/BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {DocMetadata} from "./DocMetadata";

const log = Logger.create();

export interface ImportedFile {

    /**
     * The action taken on this file:
     *
     * imported: it was imported and written to the store
     * skipped: the doc is already in the store.
     */
    readonly action: 'imported' | 'skipped';

    /**
     * The DocInfo for the file we just imported.
     */
    readonly docInfo: IDocInfo;

    /**
     * The basename of the file imported.
     */
    readonly basename: string;

    readonly backendFileRef: BackendFileRef;

}

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export namespace DocImporter {

    /**
     * Minimal metadata for the doc we want to import so that, in theory, we
     * don't have to read the DocMetadata if we already know it.
     */
    export interface IDocImport {
        readonly fingerprint: string;
        readonly title: string;
        readonly description: string;
        readonly doi?: string;
        readonly nrPages: number;
    }

    export interface DocImporterOpts {
        readonly consistency?: DatastoreConsistency;
        readonly docInfo?: Partial<IDocInfo>;
        readonly docImport?: IDocImport;
        readonly progressListener?: WriteFileProgressListener;
    }

    export async function importFile(persistenceLayerProvider: PersistenceLayerProvider,
                                     docPathOrURL: string,
                                     basename: string,
                                     opts: DocImporterOpts = {}): Promise<ImportedFile> {

        console.log(`Importing doc docPathOrURL: ${docPathOrURL}, basename: ${basename}, opts: `, opts);

        const toDocType = () => {

            if (basename.toLowerCase().endsWith(".epub")) {
                return 'epub';
            }

            if (basename.toLowerCase().endsWith(".pdf")) {
                return 'pdf';
            }

            throw new Error("Unable to determine type from basename: " + basename);

        };

        const docType = toDocType();

        const isPath = ! URLs.isURL(docPathOrURL);

        log.info(`Working with document: ${docPathOrURL}: isPath: ${isPath}`);

        const docMetadata = opts.docImport || await DocMetadata.getMetadata(docPathOrURL, docType);

        const persistenceLayer = persistenceLayerProvider();

        // TODO: this is slow to begin with... maybe we NEVER need to check if
        // we know we're always writing a NEW document.
        if (await persistenceLayer.contains(docMetadata.fingerprint)) {

            log.warn(`File already present in datastore: fingerprint=${docMetadata.fingerprint}: ${docPathOrURL}`);

            const docMeta = await persistenceLayer.getDocMeta(docMetadata.fingerprint);

            if (docMeta) {

                if (docMeta.docInfo.filename) {

                    // return the existing doc meta information.

                    const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

                    const basename = FilePaths.basename(docMeta.docInfo.filename);
                    return {
                        action: 'skipped',
                        basename,
                        docInfo: docMeta.docInfo,
                        backendFileRef: backendFileRef!
                    };

                }

            }

        }

        // create a default title from the path which is used as sometimes the
        // filename is actually a decent first attempt at a document title.

        if (!basename && ! docPathOrURL.startsWith("blob:")) {
            basename = FilePaths.basename(docPathOrURL);
        }

        const defaultTitle = opts?.docInfo?.title || basename || "";

        // TODO: this is not particularly efficient to create the hashcode
        // first, then copy the bytes to the target location.  It would be
        // better, locally, copy and compute the hash on copy but we would have
        // to rename it and that's not an operation I want to support in the
        // datastore. This could be optimized but wait until people complain
        // about it as it's probably premature at this point.

        // TODO(webapp): this doesn't work either becasue it assumes that we can
        // easily and cheaply read from the URL / blob URL but I guess that's
        // true in this situation though it's assuming a FILE and not a blob URL
        const fileHashMeta = await computeHashPrefix(docPathOrURL);

        const filename = `${fileHashMeta.hashPrefix}-` + DatastoreFiles.sanitizeFileName(basename!);

        // always read from a stream here as some of the documents we might want
        // to import could be rather large.  Also this needs to be a COPY of the
        // data, not a symlink since that's not really portable and it would
        // also be danging if the user deleted the file.  Wasting space here is
        // a good thing.  Space is cheap.

        const toBinaryFileData = async (): Promise<BinaryFileData> => {

            // TODO(webapp): make this into a toBlob function call
            if (URLs.isURL(docPathOrURL)) {
                log.info("Reading data from URL: ", docPathOrURL);
                const response = await fetch(docPathOrURL);
                return await response.blob();
            }

            return <FileHandle> {path: docPathOrURL};

        };

        const binaryFileData: BinaryFileData = await toBinaryFileData();

        const docMeta = DocMetas.create(docMetadata.fingerprint, docMetadata.nrPages, filename);

        const docInfo: IDocInfo = {
            ...docMeta.docInfo,
            title: Optional.of(docMetadata.title).getOrElse(defaultTitle),
            description: docMetadata.description,
            doi: docMetadata.doi,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: fileHashMeta.hashcode
            },
            ...(opts.docInfo || {})
        }

        docMeta.docInfo = docInfo;

        const fileRef = {
            name: filename,
            hashcode: docMeta.docInfo.hashcode
        };

        const writeFile: BackendFileRefData = {
            backend: Backend.STASH,
            data: binaryFileData,
            ...fileRef,
        };

        const writeFileOpts: WriteOpts = {
            consistency: opts.consistency,
            writeFile,
            progressListener: opts.progressListener
        }

        await persistenceLayer.write(docMetadata.fingerprint, docMeta, writeFileOpts);

        const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

        return {
            action: 'imported',
            basename,
            docInfo: docMeta.docInfo,
            backendFileRef: backendFileRef!
        };

    }

    export async function computeHashcode(docPath: string): Promise<Hashcode> {

        const fileHashMeta = await computeHashPrefix(docPath);

        const hashcode: Hashcode = {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: fileHashMeta.hashcode
        };

        return hashcode;

    }

    async function computeHashPrefix(docPath: string): Promise<FileHashMeta> {

        const inputSource = await InputSources.ofValue(docPath);

        const hashcode = await Hashcodes.createFromInputSource(inputSource);
        const hashPrefix = hashcode.substring(0, 10);

        return { hashcode, hashPrefix };

    }

}

interface FileHashMeta {
    readonly hashPrefix: string;

    readonly hashcode: string;
}
