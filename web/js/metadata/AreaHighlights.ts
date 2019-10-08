import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {AreaHighlight} from './AreaHighlight';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {DocMeta} from './DocMeta';
import {Image} from './Image';
import {Datastore} from '../datastore/Datastore';
import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Images} from './Images';
import {DocMetas} from './DocMetas';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {ArrayBuffers} from 'polar-shared/src/util/ArrayBuffers';
import {Attachment} from './Attachment';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PageMeta} from './PageMeta';
import {AreaHighlightRect} from './AreaHighlightRect';
import {HighlightRects, Position} from "polar-shared/src/metadata/IBaseHighlight";
import {DatastoreFileCache} from '../datastore/DatastoreFileCache';
import {ExtractedImage} from '../screenshots/Screenshot';
import {Screenshots} from '../screenshots/Screenshots';
import {Dimensions} from '../util/Dimensions';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {DataURLs} from '../util/DataURLs';
import {Rect} from '../Rect';
import {Rects} from '../Rects';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IImage} from "polar-shared/src/metadata/IImage";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

const log = Logger.create();

export class AreaHighlights {

    public static update(id: string,
                         docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         updates: Partial<IAreaHighlight>) {

        const existing = pageMeta.areaHighlights[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new AreaHighlight({...existing, ...updates});

        DocMetas.withBatchedMutations(docMeta, () => {
            // delete pageMeta.areaHighlights[id];
            pageMeta.areaHighlights[id] = updated;
        });

    }

    public static toCorrectScale(overlayRect: Rect) {

        const docFormat = DocFormatFactory.getInstance();

        if (docFormat.name === "pdf") {
            const currentScale = docFormat.currentScale();

            // we have to scale these number BACK to their original
            // positions at 100%

            const rescaleFactor = 1 / currentScale;

            overlayRect = Rects.scale(Rects.createFromBasicRect(overlayRect), rescaleFactor);

        }

        return overlayRect;


    }

    public static createID(created: ISODateTimeString) {
        // TODO: this needs some unique data and random is probably find.
        return Hashcodes.createID(created);
    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param opts
     * @return {AreaHighlight}
     */
    public static create(opts: IAreaHighlightOpts = {}) {

        Preconditions.assertNotNull(opts.rect, "rect");

        const created = ISODateTimeStrings.create();

        const id = AreaHighlights.createID(created);
        return new AreaHighlight({

            // per-pagemark fields.
            id,
            guid: id,

            created,

            // there is only one rect for an area highlight.
            rects: { "0": opts.rect }

        });

    }

    public static async doWrite(opts: DoWriteOpts): Promise<AreaHighlight> {

        const {datastore, pageNum, pageMeta, docMeta,
               areaHighlight, boxRect, target,
               areaHighlightRect} = opts;

        const {pageDimensions} = this.computePageDimensions(pageNum);

        // TODO: this is a problem because the area highlight isn't created
        // until we mutate it in the JSON..
        const extractedImage
            = await Screenshots.capture(pageNum, boxRect, target);

        const overlayRect = areaHighlightRect.toDimensions(pageDimensions);

        const position: Position = {
            x: overlayRect.left,
            y: overlayRect.top,
            width: overlayRect.width,
            height: overlayRect.height,
        };

        const writeOpts: AreaHighlightWriteOpts = {
            datastore,
            docMeta,
            pageMeta,
            areaHighlight,
            rect: areaHighlightRect,
            position,
            extractedImage
        };

        const writer = AreaHighlights.write(writeOpts);

        const [writtenAreaHighlight, committer] = writer.prepare();

        await committer.commit();

        return writtenAreaHighlight;
    }

    public static computePageDimensions(pageNum: number): PageDimensions {

        const docFormat = DocFormatFactory.getInstance();

        const pageElement = docFormat.getPageElementFromPageNum(pageNum);

        const dimensionsElement
            = <HTMLElement> pageElement.querySelector(".canvasWrapper, .iframeWrapper")!;

        const pageDimensions = new Dimensions({
            width: dimensionsElement.clientWidth,
            height: dimensionsElement.clientHeight
        });

        return {pageDimensions, dimensionsElement};

    }

    public static write(opts: AreaHighlightWriteOpts): AreaHighlightWriter {
        return new DefaultAreaHighlightWriter(opts);
    }

    public static async delete(opts: AreaHighlightDeleteOpts) {

        const {datastore, docMeta, pageMeta, areaHighlight} = opts;
        const {image} = areaHighlight;

        DocMetas.withBatchedMutations(docMeta, () => {

            delete pageMeta.areaHighlights[areaHighlight.id];

            if (image) {
                delete docMeta.docInfo.attachments[image.id];
            }

        });

        if (image) {
            await datastore.deleteFile(image.src.backend, image.src);
        }

    }

}

interface PageDimensions {
    readonly pageDimensions: Dimensions;
    readonly dimensionsElement: HTMLElement;
}

export interface DoWriteOpts {
    readonly datastore: Datastore | PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly pageNum: number;
    readonly areaHighlight: AreaHighlight;
    readonly target: HTMLElement;
    readonly areaHighlightRect: AreaHighlightRect;
    readonly boxRect: ILTRect;
}

export interface AreaHighlightDeleteOpts {
    readonly datastore: Datastore | PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly areaHighlight: IAreaHighlight;

}

export interface AreaHighlightWriteOpts {
    readonly datastore: Datastore | PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly areaHighlight: IAreaHighlight;
    readonly rect: AreaHighlightRect;
    readonly position: Position;
    readonly extractedImage: ExtractedImage;
}

export interface AreaHighlightWriter {

    prepare(): [AreaHighlight, AreaHighlightCommitter];

}

class DefaultAreaHighlightWriter implements AreaHighlightWriter {

    constructor(private readonly opts: AreaHighlightWriteOpts) {
    }

    public prepare(): [AreaHighlight, AreaHighlightCommitter] {

        const {docMeta, extractedImage, pageMeta, areaHighlight, rect, position} = this.opts;

        const {type, width, height} = extractedImage;

        const id = Images.createID();
        const ext = Images.toExt(type);

        const fileRef: BackendFileRef = {
            // TODO: add the data hashcode
            backend: Backend.IMAGE,
            name: `${id}.${ext}`
        };

        // WARN: THE OPERATIONS HERE ARE ORDERED FOR SAFETY
        //
        // They MUST go in the following manner:
        //
        //  - write out the metadata to memory without writing to the datastore
        //
        //  - write the new file
        //
        //  - write the new DocMeta to the datastore
        //
        //  - delete the old file (this does not need to block)
        //
        //  This CAN live a dangling older file if the write is aborted or the
        //  client crashes but this is probably rare.  It could ALSO leave a NEW
        //  file in place but it won't leave inconsistent/broken data from a
        //  user perspective.
        //
        //  The only way around the danging binary file issue might be some sort
        //  of 'tag' operation where we write the files deletable before we
        //  delete them.

        const oldImage = areaHighlight.image;

        const image = new Image({
            id, type, width, height,
            rel: 'screenshot',
            src: fileRef,
        });

        const toBlob = () => {

            if (typeof extractedImage.data === 'string') {
                return DataURLs.toBlob(extractedImage.data);
            } else {
                return ArrayBuffers.toBlob(extractedImage.data);
            }

        };

        const blob = toBlob();

        const blobURL = URL.createObjectURL(blob);

        DatastoreFileCache.writeFile(Backend.IMAGE, image.src, {
            url: blobURL
        });

        // update the DocMeta but don't write yet.  We have to make sure the
        // write of the image made to the datastore first.

        const result = DocMetas.withSkippedMutations(docMeta, () => {

            if (areaHighlight.image) {
                delete docMeta.docInfo.attachments[areaHighlight.image.id];
            }

            docMeta.docInfo.attachments[image.id] = new Attachment({fileRef});

            const rects: HighlightRects = {};
            rects["0"] = <any> rect;

            const newAreaHighlight =  new AreaHighlight({
                ...areaHighlight,
                image,
                rects,
                position,
                lastUpdated: ISODateTimeStrings.create()
            });

            // it's important that we delete first so that the ABSENT event is
            // fired
            delete pageMeta.areaHighlights[areaHighlight.id];

            pageMeta.areaHighlights[newAreaHighlight.id] = newAreaHighlight!;

            return newAreaHighlight;

        });

        const committer = new DefaultAreaHighlightCommitter(this.opts, image, blob, oldImage);

        return [result, committer];

    }

}


export interface AreaHighlightCommitter {

    commit(): Promise<void>;

}

class DefaultAreaHighlightCommitter implements AreaHighlightCommitter {

    constructor(private readonly opts: AreaHighlightWriteOpts,
                private readonly image: Image,
                private readonly blob: Blob,
                private readonly oldImage: IImage | undefined) {
    }

    public async commit(): Promise<void> {

        const {datastore, docMeta} = this.opts;
        const {image, oldImage, blob} = this;

        await datastore.writeFile(image.src.backend, image.src, blob);

        // now force a write of all the data and the current in memory version
        // will be written including the above skipped mutation.
        DocMetas.forceWrite(docMeta);

        if (oldImage) {
            datastore.deleteFile(oldImage.src.backend, oldImage.src)
                .catch(err => log.error("Unable to delete old image: ", err, oldImage));
        }

    }

}

interface IAreaHighlightOpts {
    readonly rect?: any;
}
