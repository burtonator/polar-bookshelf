import {Model} from '../../../model/Model';
import {TriggerEvent} from '../../../contextmenu/TriggerEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {TextHighlightRow} from './TextHighlightRow';
import {notNull, Preconditions} from 'polar-shared/src/Preconditions';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {DocFormat} from '../../../docformat/DocFormat';
import {KeyEvents} from '../../../KeyEvents';
import {TextHighlighterFactory} from './TextHighlighterFactory';
import {TextExtracter} from './TextExtracter';
import {TextHighlightRecord, TextHighlightRecords} from '../../../metadata/TextHighlightRecords';
import {SelectedContents} from '../selection/SelectedContents';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {TextHighlights} from '../../../metadata/TextHighlights';
import {AnnotationPointers} from '../../../annotations/AnnotationPointers';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {TypedMessage} from '../../../util/TypedMessage';
import {HighlightCreatedEvent} from '../../../comments/react/HighlightCreatedEvent';
import {Elements} from '../../../util/Elements';
import {DocMetas} from "../../../metadata/DocMetas";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {TextSelections} from "./TextSelections";
import {TextHighlightRows} from "./TextHighlightRows";

const log = Logger.create();

export class TextHighlightController {

    constructor(model: Model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();
    }

    private readonly model: Model;

    private readonly docFormat: DocFormat;

    public onDocumentLoaded() {
        log.debug("TextHighlightController.onDocumentLoaded: ", this.model.docMeta);
    }

    public start() {

        this.registerKeyDownListener();
        this.registerDocumentLoadedListener();
        this.registerWindowMessageListener();

    }

    private registerKeyDownListener() {
        document.addEventListener("keydown", event => this.onKeyDown(event));
    }

    private registerDocumentLoadedListener() {
        this.model.registerListenerForDocumentLoaded(() => this.onDocumentLoaded());
    }

    private registerWindowMessageListener() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    private async onKeyDown(event: KeyboardEvent) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if (event.code) {

                const getPageNum = () => {

                    const sel = window.getSelection()!;

                    if (sel.rangeCount >= 1) {

                        const range = sel.getRangeAt(0);

                        const startElement = range.startContainer instanceof Element ?
                            range.startContainer :
                            range.startContainer.parentElement;

                        if (startElement && startElement instanceof HTMLElement) {

                            const pageElement = Elements.untilRoot(startElement, ".page");

                            if (pageElement) {
                                return parseInt(pageElement.getAttribute("data-page-number"), 10);
                            }

                        }

                    }

                    return undefined;

                };

                const pageNum = getPageNum();

                switch (event.code) {

                    // TODO: we should not use 'code' but should use 'key'... The
                    // problem is that on OS X the key code returned 'Dead' but was
                    // working before.  Not sure why it started breaking.
                    case "KeyT":

                        if (pageNum) {
                            await this.doHighlight(pageNum);
                        }

                        break;

                    default:
                        break;

                }

            }

        }

    }

    private onMessageReceived(event: any) {

        // log.info("Received message: ", event);

        const triggerEvent = event.data;

        switch (event.data.type) {

            case "create-text-highlight":

                const typedMessage: TypedMessage<HighlightCreatedEvent> = event.data;

                const highlightColor = typedMessage.value.highlightColor;
                const pageNum = typedMessage.value.pageNum;

                this.doHighlight(pageNum, typedMessage.value.highlightColor)
                    .catch(err => log.error("Unable to create text highlight", err));

                break;

            case "delete-text-highlight":
                this.onTextHighlightDeleted(triggerEvent);
                break;

            case "scroll-to-text-highlight":
                this.onScrollToTextHighlight(triggerEvent);
                break;

            default:
                // log.warn("Unhandled message: " + event.data.type, event.data);
                break;

        }

    }

    private async doHighlight(pageNum: number,
                              highlightColor: HighlightColor = 'yellow') {

        if (this.docFormat.name === "html") {
            await this.doHighlightModern(highlightColor, pageNum);
        } else {
            this.doHighlightLegacy(highlightColor, pageNum);
        }

    }

    public doHighlightLegacy(highlightColor: HighlightColor, pageNum: number) {

        const textHighlighter = this.createLegacyTextHighlighter(highlightColor, pageNum);
        textHighlighter.doHighlight();

    }

    public async doHighlightModern(highlightColor: HighlightColor, pageNum: number) {

        log.info("Doing modern text highlight");
        await this.onTextHighlightCreatedModern(highlightColor, pageNum);

    }

    /**
     * Set text highlighting in the current document with the highlighter.
     */
    public createLegacyTextHighlighter(highlightColor: HighlightColor, pageNum: number) {

        let sequence = 0;

        const controller = this;

        let textHighlighter: any | undefined;

        const textHighlighterOptions = {

            highlightedClass: "text-highlight-span",
            color: '', // this works and the color isn't changed.
            manual: true,

            onBeforeHighlight: (range: any) => {
                // log.info("onBeforeHighlight range: ", range);
                return true;
            },

            onAfterHighlight: (range: any, highlightElements: any) => {
                // log.info("onAfterHighlight range: ", range);
                // log.info("onAfterHighlight hlts: ", highlightElements);

                const id = sequence++;
                const highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function(highlightElement: any) {
                    // highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                (async () =>  {

                    await controller.onTextHighlightCreatedLegacy("." + highlightClazz, highlightColor, pageNum);

                    // the underlying <span> highlights need to be removed now.

                    textHighlighter.removeHighlights();

                    log.info("Highlight completed.");

                })().catch(err => log.error("Unable to highlight: ", err));

            },

            onRemoveHighlight(hlt: any) {
                log.info("onRemoveHighlight hlt: ", hlt);
                return true;
            }

        };

        const targetDocument = this.docFormat.targetDocument();

        textHighlighter = TextHighlighterFactory.newInstance(targetDocument!.body, textHighlighterOptions);

        return textHighlighter;

    }

    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    private async onTextHighlightCreatedLegacy(selector: string,
                                               highlightColor: HighlightColor,
                                               pageNum: number) {

        await this.createTextHighlight(pageNum, async () => {

            // FIXME: get the new highlighter working FIRST without text and without
            // rows , or other advanced features.

            log.info("TextHighlightController.onTextHighlightCreatedLegacy");

            const textHighlightRows: TextHighlightRow[] = TextHighlightRows.createFromSelector(selector);

            const rects = textHighlightRows.map(current => current.rect);

            // TODO: don't do this from the selector because the textHighlightRows
            // would be a lot better since we have the raw elements to work with.

            // FIXME: I can call selection.toString() to get the value as a string.
            // I don't need to use extractText on the selector any more.

            const text = this.extractText(selector);

            const textSelections = TextExtracter.toTextSelections(textHighlightRows);

            return TextHighlightRecords.create(rects, textSelections, {TEXT: text}, highlightColor);

        });

    }

    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    private async onTextHighlightCreatedModern(highlightColor: HighlightColor,
                                               pageNum: number) {

        // FIXME: get the new highlighter working FIRST without text and without
        // rows , or other advanced features.

        await this.createTextHighlight(pageNum, async () => {

            const win = notNull(this.docFormat.targetDocument()).defaultView!;

            log.info("TextHighlightController.onTextHighlightCreatedModern");

            // right now we're not implementing rows...
            // let textHighlightRows = TextHighlightRows.createFromSelector(selector);

            const selectedContent = SelectedContents.compute(win);

            const rectTexts: any[] = selectedContent.rectTexts;
            const rects = rectTexts.map(current => current.boundingPageRect);

            const text = selectedContent.text;

            const textSelections = TextSelections.compute(selectedContent);

            return TextHighlightRecords.create(rects, textSelections, {TEXT: text}, highlightColor);

        });

        // let rects = textHighlightRows.map(current => current.rect);
        //
        // // TODO: don't do this from the selector because the textHighlightRows
        // // would be a lot better since we have the raw elements to work with.
        //
        // // FIXME: I can call selection.toString() to get the value as a string.
        // // I don't need to use extractText on the selector any more.
        //
        // let text = this.extractText(selector);
        //
        // let textSelections = TextExtracter.toTextSelections(textHighlightRows);
        //
        // let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);
        //
        // // now update the mode based on the current page metadata
        //
        // let currentPageMeta = this.docFormat.getCurrentPageMeta();
        //
        // let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);
        //
        // pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;
        //
        // log.info("Added text highlight to model");

    }

    public async createTextHighlight(pageNum: number,
                                     factory: () => Promise<TextHighlightRecord>): Promise<TextHighlightRecord> {

        // TODO: this really needs to be reworked so I can test it properly with
        // some sort of screenshot provider

        const doc = notNull(this.docFormat.targetDocument());
        const win = doc.defaultView!;

        const screenshotID = Hashcodes.createRandomID();

        // start the screenshot now but don't await it yet.  this way we're not
        // blocking the creation of the screenshot in the UI.
        // const selectionScreenshot = SelectionScreenshots.capture(doc, win);

        const textHighlightRecord = await factory();

        const pageMeta = DocMetas.getPageMeta(this.model.docMeta, pageNum);

        log.info("Added text highlight to model");

        // now clear the selection since we just highlighted it.
        win.getSelection()!.empty();

        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        return textHighlightRecord;

    }

    public extractText(selector: string) {

        let result = "";

        const elements: HTMLElement[]
            = Array.from(document.querySelectorAll(selector));

        if (elements.length === 0) {
            return "";
        }

        let bottom: number | undefined;
        let right: number | undefined;

        const elementFontSizeInPixels = (element: HTMLElement): number => {
            const computedStyle = window.getComputedStyle(element, null);
            const fontSize = computedStyle.getPropertyValue('font-size');
            return parseInt(fontSize);
        };

        for (const element of Array.from(elements)) {

            const rect = element.getBoundingClientRect();

            // const fontSize = elementFontSizeInPixels(element);

            // First, handle spacing for the layout which mostly just applies
            // to PDF.js but also works for html but this is almost always
            // flowing text so pretty much always just works.  PDF.js is the
            // outlier though.

            if (bottom !== undefined && rect.bottom !== bottom) {
                result += "\n";
            } else {

                if (right !== undefined) {

                    const gap = rect.left - right;

                    if (gap >= 1) {
                        result += " ";
                    }

                }

            }

            // Second, just append the text now.

            result += element.innerText;

            bottom = rect.bottom;
            right = rect.right;

        }

        return result;

    }

    private onScrollToTextHighlight(triggerEvent: TriggerEvent) {

        const annotationPointers
            = AnnotationPointers.toAnnotationPointers(".text-highlight", triggerEvent);

        Optional.first(...annotationPointers).map(annotationDescriptor => {

            const id = annotationDescriptor.id;

            const element = document.querySelector(`.annotations div[data-annotation-id='${id}']`);
            element!.scrollIntoView();

        });


    }

    /**
     * A text highlight was deleted so update the model now.
     */
    private onTextHighlightDeleted(triggerEvent: TriggerEvent) {

        log.info("Deleting text highlight from model: ", triggerEvent);

        const annotationPointers
            = AnnotationPointers.toAnnotationPointers(".text-highlight", triggerEvent);

        // should we just send this event to all the the windows?
        Optional.first(...annotationPointers).map(annotationDescriptor => {

            log.info("Deleting annotationDescriptor: ", JSON.stringify(annotationDescriptor, null, "  "));

            const pageMeta = DocMetas.getPageMeta(this.model.docMeta, annotationDescriptor.pageNum);

            // keep the current highlight.
            const textHighlight = pageMeta.textHighlights[annotationDescriptor.id];

            TextHighlights.deleteTextHighlight(pageMeta, textHighlight);

        });

        log.info("Deleting text highlight");

    }

}


