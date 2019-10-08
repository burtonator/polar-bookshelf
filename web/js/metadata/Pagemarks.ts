import {PagemarkRect} from './PagemarkRect';
import {Pagemark, PagemarkRef} from './Pagemark';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Objects} from '../util/Objects';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {PagemarkRects} from './PagemarkRects';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {round} from '../util/Percentages';
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {DocMeta} from './DocMeta';
import {DocMetas} from './DocMetas';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {PageMeta} from './PageMeta';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {ReadingProgresses} from './ReadingProgresses';
import {Provider} from 'polar-shared/src/util/Providers';
import {HitMap} from 'polar-shared/src/util/HitMap';
import {ReadingOverviews} from './ReadingOverviews';
import {Percentages} from '../util/Percentages';
import {IPageMeta, PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

const DEFAULT_PAGEMARK_RECT = new PagemarkRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});

export class Pagemarks {

    public static sequences = {
        id: 0,
        batch: 0
    };

    public static createID(created: ISODateTimeString) {
        return Hashcodes.createID({created, sequence: this.sequences.id++});
    }

    /**
     * Create pagemarks over the given range.  We go back to either the first
     * page that has a pagemark or the beginning of the document.
     *
     * @param docMeta
     * @param end
     * @param percentage The percentage of the end page to create a pagemark.
     */
    public static updatePagemarksForRange(docMeta: IDocMeta,
                                          end: PageNumber,
                                          percentage: number = 100 ): ReadonlyArray<PagemarkRef> {

        if (end < 1) {
            throw new Error("Page number must be 1 or more");
        }

        const created = ISODateTimeStrings.create();
        const batch = Hashcodes.createID({created, id: this.sequences.batch++});

        const calculateStartPage = () => {

            // find the starting page by going back to the beginning of the
            // document until we find the first pagemark or we hit the first
            // page.

            const range = [ ... Numbers.range(1, Math.max(1, end - 1)) ].reverse();

            for (const r of range) {

                const pageMeta = DocMetas.getPageMeta(docMeta, r);

                if (Dictionaries.size(pageMeta.pagemarks || {}) !== 0) {
                    // this page has a pagemark so we should start from there.
                    return r;
                }

            }

            return 1;

        };

        const createPagemarkRect = (pageNum: PageNumber, percentage: number = 100): PagemarkRect | undefined => {

            // find the pagemark that is the furthest down the page.

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            const pagemarks = Object.values(pageMeta.pagemarks || {});

            if (pagemarks.length === 0) {

                return PagemarkRects.createFromRect({
                    left: 0,
                    top: 0,
                    height: percentage,
                    width: 100
                });

            }

            let top: number = 0;

            for (const pagemark of pagemarks) {

                const newTop = pagemark.rect.top + pagemark.rect.height;

                if (newTop > top) {
                   top = newTop;
                }

            }

            const coverage: number =
                pagemarks.map(pagemark => pagemark.percentage)
                    .reduce(Reducers.SUM, 0);

            if (Math.floor(coverage) === 100 || top === 100) {

                // if this page is completely covered just ignore it

                return undefined;

            }

            return PagemarkRects.createFromRect({
                left: 0,
                top,
                height: 100 - top,
                width: 100
            });

        };

        const start = calculateStartPage();

        const result: PagemarkRef[] = [];

        DocMetas.withBatchedMutations(docMeta, () => {

            for (const pageNum of Numbers.range(start, end)) {

                const rectPercentage =
                    pageNum === end ? percentage : 100;

                const rect = createPagemarkRect(pageNum, rectPercentage);

                if (rect) {

                    const pagemark = Pagemarks.create({created, rect, batch});

                    Pagemarks.updatePagemark(docMeta, pageNum, pagemark);

                    result.push({pageNum, pagemark});

                }

            }

        });

        return result;

    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     */
    public static create(opts: Partial<PagemarkOptions> = {}): Pagemark {

        const options: PagemarkOptions = Objects.defaults( opts, {

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            // TODO: this needs to be read from the docInfo setting for this
            // document and the default here

            type: PagemarkType.SINGLE_COLUMN,

            column: 0,

        });

        const keyOptions = Pagemarks.createKeyOptions(options);

        if (keyOptions.count === 0) {
            throw new Error("Must specify either rect or percentage.");
        }

        if (keyOptions.count === 1) {

            if (keyOptions.hasPercentage) {
                keyOptions.rect = PagemarkRects.createFromPercentage(keyOptions.percentage);
            }

            if (keyOptions.hasRect) {
                keyOptions.percentage = keyOptions.rect.toPercentage();
            }

        }

        if (round(keyOptions.percentage) !== round(keyOptions.rect.toPercentage())) {
            const msg = "Percentage and rect are not the same";
            log.warn(msg, keyOptions.percentage, keyOptions.rect, keyOptions.rect.toPercentage());
            throw new Error(msg);
        }

        const created = options.created || ISODateTimeStrings.create();

        const batch = options.batch || Hashcodes.createID({created, id: this.sequences.batch++});

        const mode = options.mode || PagemarkMode.READ;

        const id = Pagemarks.createID(created);
        return new Pagemark({

            // per-pagemark fields.
            id,
            guid: id,
            created,

            // the rest are from options.
            type: options.type,

            // do NOT math.floor this.  It causes issues when percentages are
            // less than 1 and for large pages the small changes can make a
            // difference in pagemark placement
            percentage: Numbers.toFixedFloat(keyOptions.percentage, 10),

            column: options.column,
            rect: keyOptions.rect,
            batch,
            mode

        });

    }

    /**
     *
     * @param options
     * @return {KeyPagemarkOptions}
     */
    private static createKeyOptions(options: PagemarkOptions): KeyPagemarkOptions {

        const keyOptions: KeyPagemarkOptions = {
            count: 0,
            hasPercentage: false,
            hasRect: false,
            rect: options.rect,
            percentage: options.percentage
        };

        keyOptions.hasPercentage = "percentage" in options;
        keyOptions.hasRect = "rect" in options;

        if (keyOptions.hasPercentage) {
            ++keyOptions.count;
        }

        if (keyOptions.hasRect) {
            ++keyOptions.count;
        }

        return keyOptions;

    }

    /**
     *
     */
    public static upgrade(pagemarks: {[id: string]: Pagemark}) {

        const result: {[id: string]: Pagemark} = {};

        Object.assign(result, pagemarks);

        Dictionaries.forDict(result, (key, pagemark) => {

            if (! pagemark.rect) {

                if (pagemark.percentage >= 0 && pagemark.percentage <= 100) {

                    // now rect but we can build one from the percentage.
                    pagemark.rect = PagemarkRects.createFromPercentage(pagemark.percentage);

                }

            }

            // noinspection JSSuspiciousNameCombination
            if (Math.floor(pagemark.rect.top) === 100) {
                // this is a broken pagemark where the top is at the end of the
                // page which makes no sense.
                delete result[key];
                return;
            }

            if (! pagemark.id) {
                // log.debug("Pagemark given ID");
                pagemark.id = key;
            }

            if ( ! pagemark.mode) {
                // log.debug("Using default pagemark mode.");
                pagemark.mode = PagemarkMode.READ;
            }

            if ( ! isPresent(pagemark.percentage)) {
                // log.debug("No pagemark percentage. Assigning zero.");
                pagemark.percentage = 0;
            }

        });

        return result;

    }

    /**
     * Update pagemarks on the given page.
     *
     * @param pagemark The pagemark to update.
     */
    public static updatePagemark(docMeta: IDocMeta, pageNum: number, pagemark: IPagemark) {

        this.doDocMetaMutation(docMeta, pageNum, () => {
            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            this.doPageMetaMutation(pageMeta, () => {
                pageMeta.pagemarks[pagemark.id] = pagemark;
            });

        });

    }

    /**
     * Replace the pagemarks with a new pagemark with the given options
     * replaced.
     */
    public static replacePagemark(docMeta: IDocMeta,
                                  pagemarkPtr: PagemarkPTR,
                                  options: ReplacePagemarkOptions) {

        const pagemarksToMutate = () => {

            // the pagemarks to mutate.
            const result: PagemarkPageMetaRef[] = [];

            if (pagemarkPtr.ref) {

                // TODO: since we're given a pagemark directly shouldn't
                // we also resolve by the batch?

                // find the pagemarks by ref...
                const pageMeta = DocMetas.getPageMeta(docMeta, pagemarkPtr.ref.pageNum);
                result.push({pageMeta, id: pagemarkPtr.ref.pagemark.id});
            }

            if (pagemarkPtr.batch) {
                // find the pagemarks by batch...
                result.push(...this.pagemarksWithinBatch(docMeta, pagemarkPtr.batch));
            }

            return result;

        };

        // find what we should mutate
        const pagemarkRefs = pagemarksToMutate();

        // now perform the mutations on the pagemarks.  At the end we should
        // STILL compute the progress on the document as we are changing the
        // types on the pagemark.
        DocMetas.withBatchedMutations(docMeta, () => {

            for (const ref of pagemarkRefs) {

                const currPagemark = ref.pageMeta.pagemarks[ref.id];

                const newPagemark = new Pagemark(currPagemark);

                if (options.mode) {
                    newPagemark.mode = options.mode;
                }

                this.doPageMetaMutation(ref.pageMeta, () => {
                    ref.pageMeta.pagemarks[ref.id] = newPagemark;
                });

            }

        });

    }

    /**
     *
     * @param id When id is specified we delete just a specific pagemark,
     * otherwise we delete all of them.
     */
    public static deletePagemark(docMeta: IDocMeta, pageNum: number, id?: string) {

        this.doDocMetaMutation(docMeta, pageNum, () => {

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            let pageMetaMutator: VOID_FUNCTION | undefined;

            if (id) {

                const primaryPagemark = pageMeta.pagemarks[id];

                if (primaryPagemark) {

                    if (primaryPagemark.batch) {

                        // if this pagemark has a batch we have to delete everything
                        // in the same batch

                        const pagemarksWithinBatch
                            = this.pagemarksWithinBatch(docMeta, primaryPagemark.batch);

                        pageMetaMutator = () => {

                            for (const pagemarkRef of pagemarksWithinBatch) {
                                delete pagemarkRef.pageMeta.pagemarks[pagemarkRef.id];
                            }

                        };


                    } else {

                        pageMetaMutator = () => delete pageMeta.pagemarks[id];

                    }

                } else {
                    log.warn(`No pagemark found for id ${id} for pageNum ${pageNum}`);
                }

            } else {
                pageMetaMutator = () => Objects.clear(pageMeta.pagemarks);
            }

            this.doPageMetaMutation(pageMeta, pageMetaMutator);

        });

    }

    /**
     * Scan all the pagemarks finding ones with the same batch.
     */
    private static pagemarksWithinBatch(docMeta: IDocMeta, batch: string): ReadonlyArray<PagemarkPageMetaRef> {

        const result = [];

        const nrPages = Object.keys(docMeta.pageMetas).length;

        for (let pageIdx = 1; pageIdx <= nrPages; ++pageIdx) {
            const pageMeta = DocMetas.getPageMeta(docMeta, pageIdx);

            for (const pagemark of Object.values(pageMeta.pagemarks || {})) {

                if (pagemark.batch === batch) {
                    result.push({pageMeta, id: pagemark.id});
                }

            }

        }

        return result;

    }

    private static doDocMetaMutation(docMeta: IDocMeta,
                                     pageNum: number,
                                     pagemarkMutator: () => void): void {

        Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions.assertPresent(pageNum, "pageNum");

        DocMetas.withBatchedMutations(docMeta, () => {

            pagemarkMutator();

            const progress = Math.floor(DocMetas.computeProgress(docMeta) * 100);
            docMeta.docInfo.progress = progress;

            docMeta.docInfo.readingPerDay
                = ReadingOverviews.compute(Object.values(docMeta.pageMetas));

        });

    }

    /**
     * Mutate the pagemarks on the PageMeta and also update the readingProgress
     */
    private static doPageMetaMutation(pageMeta: IPageMeta, pageMetaMutator?: VOID_FUNCTION): void {

        if (! pageMetaMutator) {
            return;
        }

        const createProgressByMode = () => {

            const result = new HitMap();

            for (const pagemark of Object.values(pageMeta.pagemarks)) {
                const mode = pagemark.mode || PagemarkMode.READ;
                result.registerHit(mode, pagemark.percentage);
            }

            return result.toLiteralMap();

        };

        const writeReadingProgress = (preExisting?: boolean) => {

            const percentages = Object.values(pageMeta.pagemarks)
                .map(current => current.percentage);

            const progress = Percentages.sum(...percentages);

            const progressByMode = createProgressByMode();

            const readingProgress =
                ReadingProgresses.create(progress, progressByMode, preExisting);

            pageMeta.readingProgress[readingProgress.id] = readingProgress;

        };

        const doPreExisting =
            Dictionaries.empty(pageMeta.readingProgress) && ! Dictionaries.empty(pageMeta.pagemarks);

        if (doPreExisting) {
            writeReadingProgress(true);
        }

        pageMetaMutator();

        writeReadingProgress();

    }

    public static computeReadingProgressStats(docMetaProviders: ReadonlyArray<Provider<IDocMeta>>) {

        // TODO: we don't ahve the pageMeta here so maybe we could just write
        // out a minimal vector of day + number of the number of pages we've
        // read to the DocInfo

        for (const docMetaProvider of docMetaProviders) {

            const docMeta = docMetaProvider();



        }

    }

}

interface PagemarkPageMetaRef {
    readonly pageMeta: IPageMeta;
    readonly id: string;

}

export interface PagemarkOptions {

    /**
     * The type of pagemark we're working with.
     */
    type: PagemarkType;

    /**
     */
    rect: PagemarkRect;

    /**
     */
    percentage: number;

    column: number;

    batch?: string;

    created?: string;

    mode?: PagemarkMode;

}

/**
 * A pointer to a pagemark either by id , batch.
 */
export interface PagemarkPTR {

    readonly ref?: PagemarkRef;

    readonly batch?: string;

}

export interface ReplacePagemarkOptions {

    readonly mode?: PagemarkMode;

}

/**
 * The key / important options when creating a Pagemark.
 */
export interface KeyPagemarkOptions {

    /**
     * The total number of key options.
     */
    count: number;

    /**
     * True when we have the percentage.
     *
     */
    hasPercentage: boolean;

    /**
     * True when we have the rect.
     *
     */
    hasRect: boolean;

    /**
     */
    rect: PagemarkRect;

    /**
     */
    percentage: number;

}

export type VOID_FUNCTION = () => void;
