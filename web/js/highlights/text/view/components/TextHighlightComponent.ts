import {DocFormat} from '../../../../docformat/DocFormat';
import {AnnotationEvent} from '../../../../annotations/components/AnnotationEvent';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Component} from '../../../../components/Component';
import {DocFormatFactory} from '../../../../docformat/DocFormatFactory';
import {Rects} from '../../../../Rects';
import {Logger} from 'polar-shared/src/logger/Logger';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";

const log = Logger.create();

export class TextHighlightComponent extends Component {

    private docFormat: DocFormat;

    /**
     *
     */
    private docMeta?: IDocMeta;

    /**
     *
     */
    private textHighlight?: ITextHighlight = undefined;

    /**
     *
     */
    private pageMeta?: IPageMeta;

    /**
     * The page we're working with.
     */
    private pageNum?: number;

    /**
     * The .page we're working with.
     *
     */
    private pageElement?: HTMLElement;

    constructor() {
        super();

        this.docFormat = DocFormatFactory.getInstance();

    }

    /**
     * @Override
     * @param annotationEvent
     */
    public init(annotationEvent: AnnotationEvent) {

        // TODO: we should a specific event class for this data which is captured
        // within a higher level annotationEvent.
        this.docMeta = annotationEvent.docMeta;
        this.textHighlight = annotationEvent.value;
        this.pageMeta = annotationEvent.pageMeta;

        this.pageNum = this.pageMeta.pageInfo.num;
        this.pageElement = <HTMLElement> this.docFormat.getPageElementFromPageNum(this.pageNum);

    }

    /**
     * @Override
     */
    public render() {

        this.destroy();

        log.debug("render()");

        Dictionaries.forDict<IRect>(this.textHighlight!.rects, (id, highlightRect) => {

            const pageElement = Preconditions.assertPresent(this.pageElement);
            const pageMeta = Preconditions.assertPresent(this.pageMeta);
            const docMeta = Preconditions.assertPresent(this.docMeta);
            const textHighlight = Preconditions.assertPresent(this.textHighlight);

            log.debug("Rendering annotation at: " + JSON.stringify(highlightRect, null, "  "));

            const highlightElement = document.createElement("div");

            highlightElement.setAttribute("data-type", "text-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", docMeta.docInfo.fingerprint);
            highlightElement.setAttribute("data-text-highlight-id", textHighlight.id);
            highlightElement.setAttribute("data-page-num", `${pageMeta.pageInfo.num}`);

            // annotation descriptor metadata.
            highlightElement.setAttribute("data-annotation-type", "text-highlight");
            highlightElement.setAttribute("data-annotation-id", textHighlight.id);
            highlightElement.setAttribute("data-annotation-page-num", `${pageMeta.pageInfo.num}`);
            highlightElement.setAttribute("data-annotation-doc-fingerprint", docMeta.docInfo.fingerprint);

            const color: HighlightColor = textHighlight.color || 'yellow';

            highlightElement.setAttribute("data-annotation-color", color);

            highlightElement.className = `text-highlight annotation text-highlight-${textHighlight.id}`;

            highlightElement.style.position = "absolute";
            (highlightElement.style as any).mixBlendMode = 'multiply';

            const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

            highlightElement.style.backgroundColor = backgroundColor;
            // highlightElement.style.opacity = `0.5`;

            // toBackgroundColor

            if (this.docFormat.name === "pdf") {
                // this is only needed for PDF and we might be able to use a transform
                // in the future which would be easier.
                const currentScale = this.docFormat.currentScale();
                highlightRect = Rects.scale(highlightRect, currentScale);
            }

            highlightElement.style.left = `${highlightRect.left}px`;
            highlightElement.style.top = `${highlightRect.top}px`;

            highlightElement.style.width = `${highlightRect.width}px`;
            highlightElement.style.height = `${highlightRect.height}px`;

            // TODO: the problem with this strategy is that it inserts elements in the
            // REVERSE order they are presented visually.  This isn't a problem but
            // it might become confusing to debug this issue.  A quick fix is to
            // just reverse the array before we render the elements.
            pageElement.insertBefore(highlightElement, pageElement.firstChild);

        });

    }

    /**
     * @Override
     */
    public destroy() {

        const selector = `.text-highlight-${this.textHighlight!.id}`;
        const highlightElements = document.querySelectorAll(selector);

        log.debug(`Found N elements for selector ${selector}: ` + highlightElements.length);

        highlightElements.forEach(highlightElement => {
            highlightElement.parentElement!.removeChild(highlightElement);
        });

    }

}
