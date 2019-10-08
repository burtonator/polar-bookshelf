import {Pagemarks} from "../../../metadata/Pagemarks";
import {Logger} from 'polar-shared/src/logger/Logger';
import {Component} from '../../../components/Component';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {DocFormat} from '../../../docformat/DocFormat';
import {AnnotationEvent} from '../../../annotations/components/AnnotationEvent';
import {Pagemark} from '../../../metadata/Pagemark';
import {AnnotationRects} from '../../../metadata/AnnotationRects';
import {PagemarkRect} from '../../../metadata/PagemarkRect';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Styles} from '../../../util/Styles';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Rects} from '../../../Rects';
import {Rect} from '../../../Rect';
import {BoxController} from "../../../boxes/controller/BoxController";
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {DocMetas} from "../../../metadata/DocMetas";
import {isPresent} from 'polar-shared/src/Preconditions';
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

const log = Logger.create();

const ENABLE_BOX_CONTROLLER = true;

export class AbstractPagemarkComponent extends Component {

    /**
     * The type of the pagemark (primary or thumbnail)
     */
    private readonly type: PagemarkComponentType;

    private readonly docFormat: DocFormat;

    private pagemark?: IPagemark;

    private annotationEvent?: AnnotationEvent;

    private pagemarkBoxController: any;

    protected options: ElementOptions;

    constructor(type: PagemarkComponentType) {
        super();

        this.docFormat = DocFormatFactory.getInstance();

        this.type = type;

        this.options = {
            templateElement: undefined,
            placementElement: undefined
        };

    }

    /**
     * @Override
     */
    public init(annotationEvent: AnnotationEvent) {

        this.annotationEvent = annotationEvent;
        this.pagemark = annotationEvent.value;

        this.pagemarkBoxController = new BoxController((boxMoveEvent: any) => this.onBoxMoved(boxMoveEvent));

    }

    /**
     *
     * @param boxMoveEvent {BoxMoveEvent}
     */
    public onBoxMoved(boxMoveEvent: any) {

        log.info("Box moved to: ", boxMoveEvent);

        // boxRect, containerRect, pageRect...

        const annotationRect = AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect,
                                                                        boxMoveEvent.restrictionRect);

        const rect = new PagemarkRect(annotationRect);

        if (boxMoveEvent.state === "completed") {

            log.info("Box move completed.  Updating to trigger persistence.");

            const annotationEvent = this.annotationEvent!;
            const pageNum = annotationEvent.pageMeta.pageInfo.num;
            const docMeta = annotationEvent.docMeta;

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            // re-read the current pagemark from the model
            this.pagemark = pageMeta.pagemarks[this.pagemark!.id];

            const newPagemark = Object.assign({}, this.pagemark);
            newPagemark.percentage = rect.toPercentage();
            newPagemark.rect = rect;

            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));
            Pagemarks.updatePagemark(annotationEvent.docMeta, pageNum, newPagemark);

            this.pagemark = newPagemark;

        } else {
            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));
        }

        log.info("New pagemarkRect: ", this.pagemark!.rect);

    }

    /**
     * @Override
     *
     */
    public render() {

        // TODO: placemenElement should be called containerElement

        // TODO: we should have pagemarkRect and positionedPagemarkRect too

        // TODO: see of templateElement and placementElement are always the
        //       same now.  They might be.

        //
        // - the options building can't be reliably tested
        //
        // - there are too many ways to compute the options
        //
        // - we PLACE the element as part of this function.  Have a secondary
        //   way to just CREATE the element so that we can test the settings
        //   properly.

        const container = this.annotationEvent!.container;
        Preconditions.assertPresent(container, "container");

        if (!this.pagemark) {
            throw new Error("Pagemark is required");
        }

        if (!isPresent(this.pagemark.percentage)) {
            throw new Error("Pagemark has no percentage");
        }

        let templateElement = this.options.templateElement;
        let placementElement = this.options.placementElement;

        if (!templateElement) {
            templateElement = container.element;
        }

        if (! placementElement) {
            // TODO: move this to the proper component
            placementElement = <HTMLElement> container.element.querySelector(".canvasWrapper, .iframeWrapper");
            // TODO: we need to code this directly into the caller
            log.debug("Using a default placementElement from selector: ", placementElement);
        }

        Preconditions.assertNotNull(templateElement, "templateElement");
        Preconditions.assertNotNull(placementElement, "placementElement");

        log.info("Using templateElement: ", templateElement);
        log.info("Using placementElement: ", placementElement);

        // a unique ID in the DOM for this element.
        const id = this.createID();

        let pagemarkElement = document.getElementById(id);

        if (pagemarkElement === null ) {
            // only create the pagemark if it's missing.
            pagemarkElement = document.createElement("div");
            pagemarkElement.setAttribute("id", id);

            placementElement.parentElement!.insertBefore(pagemarkElement, placementElement);

            if (ENABLE_BOX_CONTROLLER) {
                log.info("Creating box controller for pagemarkElement: ", pagemarkElement);
                this.pagemarkBoxController.register({
                    target: pagemarkElement,
                    restrictionElement: placementElement,
                    intersectedElementsSelector: ".pagemark"
                });
            }

        }

        const annotationEvent = this.annotationEvent!;

        // set a pagemark-id in the DOM so that we can work with it when we use
        // the context menu, etc.
        // TODO: this is duplicated code across three places.. all major
        // annotation components.
        pagemarkElement.setAttribute("data-pagemark-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-type", "pagemark");
        pagemarkElement.setAttribute("data-annotation-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-annotation-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);


        pagemarkElement.setAttribute("data-type", "pagemark");
        pagemarkElement.setAttribute("data-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);


        // make sure we have a reliable CSS classname to work with.
        pagemarkElement.className = "pagemark annotation";

        // pagemark.style.backgroundColor="rgb(198, 198, 198)";

        const pagemarkColor = this.toPagemarkColor();

        pagemarkElement.style.backgroundColor = pagemarkColor.backgroundColor;
        pagemarkElement.style.opacity = "" + pagemarkColor.opacity;

        (pagemarkElement.style as any).mixBlendMode = 'multiply';

        pagemarkElement.style.position = "absolute";

        // TODO: we don't actually need the placement rect.. just the dimensions
        // of the container.
        const placementRect = this.createPlacementRect(placementElement);
        const pagemarkRect = this.toOverlayRect(placementRect, this.pagemark);

        if (this.type === 'primary') {

            if (pagemarkElement.children.length === 0) {
                this.createInternalDiv(pagemarkElement);
            }

        }

        // TODO: what I need is a generic way to cover an element and place
        // something on top of it no matter what positioning strategy it uses.

        pagemarkElement.style.left = `${pagemarkRect.left}px`;
        pagemarkElement.style.top = `${pagemarkRect.top}px`;
        pagemarkElement.style.width = `${pagemarkRect.width}px`;
        pagemarkElement.style.height = `${pagemarkRect.height}px`;
        pagemarkElement.style.zIndex = '9';
        pagemarkElement.style.pointerEvents = 'none';

    }

    /**
     * Create an internal div that allows us to turn off pointer-events
     */
    private createInternalDiv(pagemarkElement: HTMLElement) {

        const createInternalDiv = () => {

            const internalDiv = document.createElement('div');

            // internalDiv.style.backgroundColor = 'pink';
            internalDiv.style.pointerEvents = 'auto';
            internalDiv.style.position = 'absolute';

            return internalDiv;

        };

        const createHorizontalInternalDiv = () => {

            const internalDiv = createInternalDiv();

            internalDiv.style.width = '100%';
            internalDiv.style.height = '2mm';

            return internalDiv;

        };

        const createVerticalInternalDiv = () => {

            const internalDiv = createInternalDiv();

            internalDiv.style.width = '2mm';
            internalDiv.style.height = '100%';

            return internalDiv;

        };

        const createInternalDivs = () => {

            // TODO: this could be cleaned up a bit by passing position directly

            const left = createVerticalInternalDiv();
            left.style.left = '0';
            left.style.top = '0';

            const right = createVerticalInternalDiv();
            right.style.right = '0';
            right.style.top = '0';

            const top = createHorizontalInternalDiv();
            top.style.left = '0';
            top.style.top = '0';

            const bottom = createHorizontalInternalDiv();
            bottom.style.bottom = '0';
            bottom.style.left = '0';

            return [ left, right, top, bottom];

        };

        const internalDivs = createInternalDivs();

        type PointerEvents = 'auto' | 'none';

        let pointerEvents: PointerEvents = 'auto';

        const doChangePointerEvents = (newValue: PointerEvents) => {

            if (pointerEvents !== newValue) {
                pagemarkElement.style.pointerEvents = newValue;
                pointerEvents = newValue;
            }

        };

        for (const internalDiv of internalDivs) {

            internalDiv.addEventListener('mouseenter', (event) => {
                doChangePointerEvents('auto');
                event.preventDefault();
            });

            internalDiv.addEventListener('mouseleave', (event) => {
                doChangePointerEvents('none');
                event.preventDefault();
            });

            pagemarkElement.appendChild(internalDiv);

        }

    }

    private toPagemarkColor() {

        class PagemarkColors {

            public static BLUE = {
                backgroundColor: "#00CCFF",
                opacity: 0.3
            };

            public static LIGHTBLUE = {
                backgroundColor: "#00CCFF",
                opacity: 0.15
            };

            public static GREY = {
                backgroundColor: "rgb(125, 125, 125)",
                opacity: 0.3
            };

        }

        if (! this.pagemark) {
            return PagemarkColors.BLUE;
        }

        if (!this.pagemark.mode) {
            return PagemarkColors.BLUE;
        }

        switch (this.pagemark.mode) {

            case PagemarkMode.IGNORED:
                return PagemarkColors.GREY;

            case PagemarkMode.TABLE_OF_CONTENTS:
                return PagemarkColors.GREY;

            case PagemarkMode.APPENDIX:
                return PagemarkColors.GREY;

            case PagemarkMode.REFERENCES:
                return PagemarkColors.GREY;

            case PagemarkMode.PRE_READ:
                return PagemarkColors.LIGHTBLUE;

            default:
                return PagemarkColors.BLUE;

        }

    }

    /**
     * @Override
     * @returns {*}
     */
    public destroy() {

        const pagemarkElement = document.getElementById(this.createID());

        if (pagemarkElement) {

            pagemarkElement.innerHTML = '';

            if (pagemarkElement.parentElement) {
                pagemarkElement.parentElement.removeChild(pagemarkElement);
            }

        }

    }

    private createPlacementRect(placementElement: HTMLElement) {

        const positioning = Styles.positioning(placementElement);
        const positioningPX = Styles.positioningToPX(positioning);

        // TODO: this could be cleaned up a bit...

        // TODO: the offsetWidth does not properly have the width applied to
        // it for some reason when scale is being used.  getBoundingClientRect
        // works though.

        const result = {
            left: Optional.of(positioningPX.left).getOrElse(placementElement.offsetLeft),
            top: Optional.of(positioningPX.top).getOrElse(placementElement.offsetTop),
            width: Optional.of(positioningPX.width).getOrElse(placementElement.offsetWidth),
            height: Optional.of(positioningPX.height).getOrElse(placementElement.offsetHeight),
        };

        return Rects.createFromBasicRect(result);

    }

    /**
     * Create a unique DOM ID for this pagemark.
     */
    private createID() {
        return `${this.type}-pagemark-${this.pagemark!.id}`;
    }

    // TODO: I have to improve this grammar... placement, positioned, etc..
    // which one is which.

    private toOverlayRect(placementRect: Rect, pagemark: Pagemark | IPagemark) {

        const pagemarkRect = new PagemarkRect(pagemark.rect);

        const overlayRect = pagemarkRect.toDimensions(placementRect.dimensions);

        // we have to apply the original placementRect top and left so it's
        // placed as a proper overlay
        return Rects.createFromBasicRect({
            left: overlayRect.left + placementRect.left,
            top: overlayRect.top + placementRect.top,
            width: overlayRect.width,
            height: overlayRect.height,
        });

    }

}

export interface ElementOptions {
    templateElement?: HTMLElement;
    placementElement?: HTMLElement;
}

type PagemarkComponentType = 'primary' | 'thumbnail';

interface PagemarkColor {
    backgroundColor: string;
    opacity: number;
}
