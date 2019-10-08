import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {Reactor} from '../reactor/Reactor';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Pagemarks} from '../metadata/Pagemarks';
import {DocMetaDescriber} from '../metadata/DocMetaDescriber';
import {Logger} from 'polar-shared/src/logger/Logger';
import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {ModelPersisterFactory} from './ModelPersisterFactory';
import {DocDetail} from '../metadata/DocDetail';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {PersistenceLayerHandler} from '../datastore/PersistenceLayerHandler';
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

const NULL_DOC_META = DocMetas.create('0x0001', 0);

export class Model {

    // TODO: we should probably not set this via a global as it might not
    // be loaded yet and / or might be invalidated if the document is closed.
    //
    // TODO: we create a fake document which is eventually replaced.
    public docMeta: IDocMeta = NULL_DOC_META;

    public readonly persistenceLayerProvider: () => ListenablePersistenceLayer;

    private readonly modelPersisterFactory: ModelPersisterFactory;

    private reactor: Reactor<any>;

    private docMetaPromise: Promise<IDocMeta> = Promise.resolve(NULL_DOC_META);

    constructor(public readonly persistenceLayerHandler: PersistenceLayerHandler) {

        this.persistenceLayerProvider = () => persistenceLayerHandler.get();
        this.modelPersisterFactory = new ModelPersisterFactory(persistenceLayerHandler);

        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('createPagemark');
        this.reactor.registerEvent('erasePagemark');

    }

    /**
     * Called when a new document has been loaded.
     */
    public async documentLoaded(fingerprint: string,
                                nrPages: number,
                                currentPageNumber: number,
                                docDetail: DocDetail | undefined) {

        log.notice("Document loaded with fingerprint: " + fingerprint);

        const persistenceLayer = this.persistenceLayerProvider();

        let docMeta = await persistenceLayer.getDocMeta(fingerprint);

        if (!docMeta) {

            console.warn("New document found. Creating initial DocMeta");

            // this is a new document...

            docMeta = DocMetas.create(fingerprint,
                                      nrPages,
                                      Optional.of(docDetail).map(current => current.filename)
                                          .getOrUndefined());

            await persistenceLayer.write(fingerprint, docMeta);

            // I'm not sure this is the best way to resolve this as swapping in
            // the docMetaPromise without any synchronization seems like we're
            // asking for a race condition.

        }

        if (docMeta === undefined) {
            throw new Error("Unable to load DocMeta: " + fingerprint);
        }

        this.docMeta = docMeta;

        log.info("Description of doc loaded: " + DocMetaDescriber.describe(this.docMeta));
        log.info("Document loaded: ", fingerprint);

        const modelPersister = this.modelPersisterFactory.create(docMeta);

        this.docMeta = modelPersister.docMeta;

        // always provide this promise for the metadata.  For NEW documents
        // we have to provide the promise but we ALSO have to provide it
        // to swap out the docMeta with the right version.
        this.docMetaPromise = Promise.resolve(docMeta);

        this.handleExtendedMetadataExtraction();

        this.reactor.dispatchEvent('documentLoaded', {
            fingerprint,
            nrPages,
            currentPageNumber,
            docMeta: this.docMeta
        });

        return this.docMeta;

    }

    /**
     * Go through and extract additional metadata on first page load.
     */
    private handleExtendedMetadataExtraction() {

        const docFormat = DocFormatFactory.getInstance();

        const currentPageElement = docFormat.getCurrentPageElement();

        if (!currentPageElement) {
            log.warn("No current page element");
            return;
        }

        const pageNum = docFormat.getPageNumFromPageElement(currentPageElement);

        if (pageNum !== 1) {
            log.warn("Working with wrong page number: " + pageNum);
            return;
        }

        DocMetas.withBatchedMutations(this.docMeta, () => {

            const pageMeta = DocMetas.getPageMeta(this.docMeta, pageNum);

            if (!pageMeta.pageInfo.dimensions) {
                const currentPageDetail = docFormat.getCurrentPageDetail();

                if (currentPageDetail.dimensions) {
                    pageMeta.pageInfo.dimensions = currentPageDetail.dimensions;
                }

            }

        });

    }

    public registerListenerForDocumentLoaded(eventListener: DocumentLoadedCallback) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }

    /**
     * @refactor This code should be in its own dedicated helper class
     *
     * @param pageNum The page num to use for our created pagemark.
     * @param options Options for creating the pagemark.
     */
    public async createPagemark(pageNum: number, options: any = {}) {

        if (!options.percentage) {
            options.percentage = 100;
        }

        log.info("Model sees createPagemark");

        this.assertPageNum(pageNum);

        const pagemark = Pagemarks.create({

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            type: PagemarkType.SINGLE_COLUMN,
            percentage: options.percentage,
            column: 0

        });

        const docMeta = await this.docMetaPromise;

        Pagemarks.updatePagemark(docMeta, pageNum, pagemark);

        // TODO: this can be done with a mutation listener now
        this.reactor.dispatchEvent('createPagemark', {pageNum, pagemark});

    }

    public async createPagemarksForRange(end: PageNumber, percentage: number) {

        const docMeta = await this.docMetaPromise;

        const pagemarkRefs = Pagemarks.updatePagemarksForRange(docMeta, end, percentage);

        for (const pagemarkRef of pagemarkRefs) {
            this.reactor.dispatchEvent('createPagemark', pagemarkRef);
        }

    }

    /**
     * @refactor This code should move to Pagemarks.ts
     * @param pageNum
     */
    public erasePagemark(pageNum: number) {

        Preconditions.assertNumber(pageNum, "pageNum");

        log.info("Model sees erasePagemark");

        this.assertPageNum(pageNum);

        if (this.docMeta) {

            Pagemarks.deletePagemark(this.docMeta, pageNum);

            this.reactor.dispatchEvent('erasePagemark', {pageNum});

        }

    }

    private assertPageNum(pageNum: number) {

        if (pageNum == null) {
            throw new Error("Must specify page pageNum");
        }

        if (pageNum <= 0) {
            throw new Error("Page numbers begin at 1");
        }

    }

}

export interface DocumentLoadedEvent {
    readonly fingerprint: string;
    readonly nrPages: number;
    readonly currentPageNumber: number;
    readonly docMeta: IDocMeta;
}

export type DocumentLoadedCallback = (event: DocumentLoadedEvent) => void;

