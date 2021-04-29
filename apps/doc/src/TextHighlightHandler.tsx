import * as React from "react";
import {IDocViewerStore, useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import {
    ITextHighlightCreate,
    useAnnotationMutationsContext
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {TextHighlighter} from "./text_highlighter/TextHighlighter";
import {useDocViewerContext} from "./renderers/DocRenderer";
import {SelectedContents} from "../../../web/js/highlights/text/selection/SelectedContents";
import {ISelectedContent} from "../../../web/js/highlights/text/selection/ISelectedContent";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import { useDocViewerElementsContext } from "./renderers/DocViewerElementsContext";
import {IDStr} from "polar-shared/src/util/Strings";
import {ActiveSelectionListener, ActiveSelections} from "../../../web/js/ui/popup/ActiveSelections";
import {FileType} from "../../../web/js/apps/main/file_loaders/FileType";
import {isPresent} from "polar-shared/src/Preconditions";
import {Elements} from "../../../web/js/util/Elements";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";


/**
 * The minimum properties we need to annotate without having to have the full
 * store context like docMeta.
 */
interface ICreateTextHighlightCallbackOpts {

    /**
     * The document ID (fingerprint) in this this document as created.
     */
    readonly docID: IDStr;

    readonly pageNum: number;

    readonly highlightColor: HighlightColor;

    readonly selectedContent: ISelectedContent;

}

type CreateTextHighlightCallback = (opts: ICreateTextHighlightCallbackOpts) => ITextHighlight | null;

function useCreateTextHighlightCallback(): CreateTextHighlightCallback {

    const annotationMutations = useAnnotationMutationsContext();
    const {docMeta, docScale} = useDocViewerStore(['docMeta', 'docScale']);
    const docViewerElementsContext = useDocViewerElementsContext();

    return (opts: ICreateTextHighlightCallbackOpts): ITextHighlight | null => {

        if (docMeta === undefined) {
            throw new Error("No docMeta");
        }

        if (docScale === undefined) {
            throw new Error("No docScale");
        }

        if (docMeta.docInfo.fingerprint !== opts.docID) {
            // this text highlight is from another doc.
            return null;
        }

        // TODO: what if this page isn't visible
        const pageElement = docViewerElementsContext.getPageElementForPage(opts.pageNum)!;

        const {pageMeta, textHighlight}
            = TextHighlighter.createTextHighlight({...opts, docMeta, docScale, pageElement});

        const mutation: ITextHighlightCreate = {
            type: 'create',
            docMeta, pageMeta, textHighlight
        }

        annotationMutations.onTextHighlight(mutation);
        return textHighlight;
    };

}

/**
 * Function that will register our event listeners when returned.
 */
export type AnnotationBarEventListenerRegisterer = () => void;

function computeTargets(fileType: FileType, docViewerElementProvider: () => HTMLElement): ReadonlyArray<HTMLElement> {

    const docViewerElement = docViewerElementProvider();

    function computeTargetsForPDF(): ReadonlyArray<HTMLElement> {
        return Array.from(docViewerElement.querySelectorAll(".page")) as HTMLElement[];
    }

    function computeTargetsForEPUB(): ReadonlyArray<HTMLElement> {
        return Array.from(docViewerElement.querySelectorAll("iframe"))
                    .map(iframe => iframe.contentDocument)
                    .filter(contentDocument => isPresent(contentDocument))
                    .map(contentDocument => contentDocument!)
                    .map(contentDocument => contentDocument.documentElement)
    }

    switch(fileType) {

        case "pdf":
            return computeTargetsForPDF();

        case "epub":
            return computeTargetsForEPUB();

    }
}

export const TextHighlightHandler: React.FC = () => {
    const docViewerElementsContext = useDocViewerElementsContext();
    const createTextHighlight = useCreateTextHighlightCallback();
    const {setHighlightBar} = useDocViewerCallbacks();
    const {fileType} = useDocViewerContext();
    const store = React.useRef<Pick<IDocViewerStore, 'docMeta' | 'docScale' | 'textHighlightColor'>>();
    store.current = useDocViewerStore(['docMeta', 'docScale', 'textHighlightColor']);
    const createTextHighlightCallback = React.useRef<CreateTextHighlightCallback>()
    createTextHighlightCallback.current = createTextHighlight;
    

    React.useEffect(() => {
        const targets = computeTargets(fileType, docViewerElementsContext.getDocViewerElement);
        const handleSelection: ActiveSelectionListener = (event) => {
            const {selection} = event;
            const {docMeta, textHighlightColor} = store.current!;
            /*
            if (!textHighlightColor) {
                return;
            }
            */

            function getPageNumberForPageElement() {
                const getNumber = (pageElement: HTMLElement) => parseInt(pageElement.getAttribute("data-page-number")!, 10);
                if (fileType === "pdf") {
                    const pageElement = Elements.untilRoot(event.element, ".page");
                    return getNumber(pageElement);
                } else {
                    const docViewerElement = docViewerElementsContext.getDocViewerElement();
                    const pageElement = docViewerElement.querySelector('.page') as HTMLElement;
                    return getNumber(pageElement);
                }
            }

            const opts: SelectedContents.ComputeOpts = {
                noRectTexts: fileType === "epub",
                fileType,
            };
            const selectedContent = SelectedContents.computeFromSelection(selection, opts);

            // now clear the selection since we just highlighted it.
            selection.empty();

            const docID = docMeta?.docInfo.fingerprint;

            if (docID) {

                const pageNum = getPageNumberForPageElement()!;

                const textHighlight = createTextHighlightCallback.current!({
                    selectedContent,
                    highlightColor: textHighlightColor || "#00FFFF",
                    docID,
                    pageNum,
                });
                if (textHighlight) {
                    setHighlightBar({ highlightID: textHighlight.id, type: AnnotationType.TEXT_HIGHLIGHT, pageNum });
                }
            } else {
                console.warn("No docID")
            }
        };

        for (const target of targets) {
            console.log('debug: registering');
            ActiveSelections.addEventListener(handleSelection, target);
        }
    }, []);

    return null;
}
