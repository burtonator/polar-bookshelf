import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import {
    IPagemarkDelete,
    useDocViewerCallbacks,
    useDocViewerStore
} from "./DocViewerStore";
import {
    IMouseEvent,
    MenuComponentProps
} from "../../repository/js/doc_repo/MUIContextMenu";
import {Elements} from "../../../web/js/util/Elements";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {IPoint} from "../../../web/js/Point";
import {useAreaHighlightHooks} from "./annotations/AreaHighlightHooks";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {
    IAnnotationMeta,
    IAnnotationRef
} from "polar-shared/src/metadata/AnnotationRefs";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {useAnnotationMutationsContext} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IDocMetas} from "polar-shared/src/metadata/IDocMetas";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Numbers} from "polar-shared/src/util/Numbers";
import {InvalidInput} from "../../../web/js/ui/dialogs/InputValidators";
import {FileType} from "../../../web/js/apps/main/file_loaders/FileType";
import {Ranges} from "../../../web/js/highlights/text/selection/Ranges";
import {Clipboards} from "../../../web/js/util/system/clipboard/Clipboards";
import {MUIMenuSubheader} from "../../../web/js/mui/menu/MUIMenuSubheader";
import {ISelectOption} from "../../../web/js/ui/dialogs/SelectDialog";
import {PagemarkMode} from "polar-shared/src/metadata/PagemarkMode";
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import {MUIMenuSection} from "../../../web/js/mui/menu/MUIMenuSection";
import {useJumpToAnnotationHandler} from "../../../web/js/annotation_sidebar/JumpToAnnotationHook";
import { Arrays } from "polar-shared/src/util/Arrays";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {AnnotationPtrs} from "../../../web/js/annotation_sidebar/AnnotationPtrs";

type AnnotationMetaResolver = (annotationMeta: IAnnotationMeta) => IAnnotationRef;

function useAnnotationMetaToRefResolver(): AnnotationMetaResolver {

    const {docMeta} = useDocViewerStore(['docMeta']);

    return React.useCallback((annotationMeta: IAnnotationMeta): IAnnotationRef => {

        const {id, annotationType, pageNum} = annotationMeta;

        if (! docMeta) {
            throw new Error("No docMeta");
        }

        const pageMeta = IDocMetas.getPageMeta(docMeta, pageNum);

        function getOriginal(): IPagemark | ITextHighlight | IAreaHighlight {

            switch (annotationType) {
                case AnnotationType.PAGEMARK:
                    return (pageMeta.pagemarks || {})[id];
                case AnnotationType.TEXT_HIGHLIGHT:
                    return (pageMeta.textHighlights || {})[id];
                case AnnotationType.AREA_HIGHLIGHT:
                    return (pageMeta.areaHighlights || {})[id];
                default:
                    throw new Error("Unsupported annotationType: " + annotationMeta.annotationType);
            }

        }

        const original = getOriginal();

        return {
            id, annotationType, pageNum,
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            original
        }

    }, [docMeta]);

}

export interface IDocViewerContextMenuOrigin {

    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly pageNum: number;
    readonly clientX: number;
    readonly clientY: number;
    readonly pointWithinPageElement: IPoint;

    readonly target: EventTarget | null;
    readonly fileType: FileType;

    readonly hasSelection: boolean;

    readonly selectionToText: () => string;

    readonly pagemarks: ReadonlyArray<IAnnotationMeta>;
    readonly areaHighlights: ReadonlyArray<IAnnotationMeta>;
    readonly textHighlights: ReadonlyArray<IAnnotationMeta>;

    /**
     * The first range when we're activated.
     */
    readonly range: Range | undefined;

    readonly pageX: number;
    readonly pageY: number;

    readonly windowWidth: number;
    readonly windowHeight: number;

}

/**
 * Pagemarks have pointer-events: none and they don't show up when using
 * elementsFromPoint so we have to temporarily enable them.
 */
function withPointerEvents<T>(element: HTMLElement,
                              className: string,
                              delegate: () => T) {

    interface ElementStyleRestore {
        readonly element: HTMLElement;
        readonly pointerEvents: string | null;
    }

    const elements = Array.from(element.querySelectorAll("." + className)) as ReadonlyArray<HTMLElement>;

    const elementStyleRestores: ElementStyleRestore[] = [];

    for (const element of elements) {

        elementStyleRestores.push({
            element,
            pointerEvents: element.style.pointerEvents
        });

        element.style.pointerEvents = 'auto';

    }

    try {

        return delegate();

    } finally {

        for (const restore of elementStyleRestores) {
            restore.element.style.pointerEvents = restore.pointerEvents!;
        }

    }

}

function selectedElements(pageElement: HTMLElement,
                          point: IPoint,
                          className: string): ReadonlyArray<HTMLElement> {

    return withPointerEvents(pageElement, className, () => {

        const doc = pageElement.ownerDocument;
        const elements = doc.elementsFromPoint(point.x, point.y) as HTMLElement[];

        return elements.filter(element => element.classList.contains(className));

    })

}

function selectedAnnotationMetas(pageElement: HTMLElement,
                                 pageNum: PageNumber,
                                 annotationType: AnnotationType,
                                 point: IPoint,
                                 className: string): ReadonlyArray<IAnnotationMeta> {

    function toAnnotationMeta(element: HTMLElement): IAnnotationMeta {
        const id = element.getAttribute("data-annotation-id");
        if (! id) {
            throw new Error("No id for annotation type: " + annotationType);
        }
        return {id, pageNum, annotationType};
    }

    return selectedElements(pageElement, point, className).map(toAnnotationMeta);

}

export function computeDocViewerContextMenuOrigin(event: IMouseEvent): IDocViewerContextMenuOrigin | undefined {

    const target = event.target as HTMLElement;

    interface ContextPageMeta {
        readonly fileType: FileType;

        /**
         * Contains the .page
         */
        readonly pageElement: HTMLElement;

        readonly pageNum: number;
    }

    function computeContextPageMeta(): ContextPageMeta {

        function computePageElementWithFileType(): [HTMLElement, FileType] {

            const pageElement = Elements.untilRoot(target, ".page");

            if (pageElement) {
                return [pageElement, 'pdf'];
            }

            // find the root .page in PDF mode or document.body when in EPUB
            return [event.nativeEvent.view!.document.body, 'epub'];

        }

        const [pageElement, fileType] = computePageElementWithFileType();

        function parsePageNumFromPageElement(pageElement: HTMLElement) {
            return parseInt(pageElement.getAttribute("data-page-number")!)
        }

        function computePageNumForPDF(): number {
            return parsePageNumFromPageElement(pageElement);
        }

        function computePageNumForEPUB(): number {
            const pageElement = Elements.untilRoot(event.nativeEvent.view!.frameElement as HTMLElement, '.page');
            return parsePageNumFromPageElement(pageElement);
        }

        function computePageNum() {

            switch (fileType) {
                case "pdf":
                    return computePageNumForPDF();
                case "epub":
                    return computePageNumForEPUB();
            }

        }

        const pageNum = computePageNum();

        return {pageElement, pageNum, fileType};

    }

    const {pageElement, pageNum, fileType} = computeContextPageMeta();

    const eventTargetOffset = Elements.getRelativeOffsetRect(target, pageElement);

    function computePointWithinPageElement(): IPoint {

        const pageElementBCR = pageElement.getBoundingClientRect();

        return {
            x: event.clientX - pageElementBCR.x,
            y: event.clientY - pageElementBCR.y
        };

    }

    const pointWithinPageElement = computePointWithinPageElement();

    const point = {x: event.clientX, y: event.clientY};

    const pagemarks = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.PAGEMARK, point, 'pagemark');
    const areaHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.AREA_HIGHLIGHT, point, 'area-highlight');
    const textHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.TEXT_HIGHLIGHT, point, 'text-highlight');

    const hasSelection: boolean = event.nativeEvent.view !== null && event.nativeEvent.view.getSelection() !== null;

    function selectionToText(): string {

        if (! event.nativeEvent.view) {
            return "";
        }

        const selection = event.nativeEvent.view.getSelection();

        if (! selection) {
            return "";
        }

        return Ranges.toText(selection.getRangeAt(0));

    }

    function computeRange() {

        const view = event.nativeEvent.view;

        if (! view) {
            return undefined;
        }

        const selection = view.getSelection();

        if (! selection) {
            return undefined;
        }

        if (selection.rangeCount === 0) {
            return undefined;
        }

        return selection.getRangeAt(0);

    }

    const range = computeRange();

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        windowWidth: event.nativeEvent.view!.innerWidth,
        windowHeight: event.nativeEvent.view!.innerHeight,
        x: eventTargetOffset.left + (event.nativeEvent as any).offsetX,
        y: eventTargetOffset.top + (event.nativeEvent as any).offsetY,
        width: pageElement.clientWidth,
        height: pageElement.clientHeight,
        pointWithinPageElement,
        pageNum,
        pagemarks,
        areaHighlights,
        textHighlights,
        fileType,
        hasSelection,
        selectionToText,
        target: event.target,
        range
    };

}

export const DocViewerMenu = (props: MenuComponentProps<IDocViewerContextMenuOrigin>) => {

    const {docDescriptor} = useDocViewerStore(['docDescriptor']);
    const {onPagemark} = useDocViewerCallbacks();
    const {onAreaHighlightCreated} = useAreaHighlightHooks();
    const annotationMutationsContext = useAnnotationMutationsContext();
    const annotationMetaToRefResolver = useAnnotationMetaToRefResolver();
    const dialogManager = useDialogManager();
    const jumpToAnnotationHandler = useJumpToAnnotationHandler();

    const origin = props.origin!;

    const onCreatePagemarkToPoint = React.useCallback(() => {

        onPagemark({
            type: 'create-to-point',
            x: origin.x,
            y: origin.y,
            width: origin.width,
            height: origin.height,
            pageNum: origin.pageNum,
            range: origin.range
        });

    }, [onPagemark, origin]);

    const onCreatePagemarkFromPage = React.useCallback(() => {

        function onDone(fromPage: number) {

            onPagemark({
                type: 'create-from-page',
                ...origin,
                fromPage
            });

        }

        const nrPages = docDescriptor!.nrPages;

        function inputValidator(value: string): InvalidInput | undefined {

            function createResult(message: string): InvalidInput {
                return {message};
            }

            if (! Numbers.isNumber(value)) {
                return createResult("Input given must be a number");
            }

            const fromPage = parseInt(value);

            if (fromPage <= 0) {
                return createResult("Page must start at 1.");
            }

            if (fromPage > nrPages) {
                return createResult(`Page too large. Document is only ${nrPages} in length`);
            }

            if (fromPage > origin.pageNum) {
                return createResult("Page may not exceed " + origin.pageNum);
            }

            return undefined;

        }

        const pageLimit = Math.min(nrPages, origin.pageNum);

        dialogManager.prompt({
            title: "Create Pagemark From Page",
            description: "Enter a starting page from which to create the pagemark: ",
            placeholder: `Enter a page from 1 to ${pageLimit}`,
            type: 'number',
            autoComplete: 'off',
            inputValidator,
            onCancel: NULL_FUNCTION,
            onDone: (value: string) => onDone(parseInt(value))
        });

    }, [dialogManager, docDescriptor, onPagemark, origin]);

    const onCreateAreaHighlight = React.useCallback(() => {
        const {pageNum, pointWithinPageElement} = origin;

        onAreaHighlightCreated({pageNum, pointWithinPageElement});

    }, [onAreaHighlightCreated, origin]);

    const onDeletePagemark = (annotations: ReadonlyArray<IAnnotationMeta>) => {

        function toMutation(annotationRef: IAnnotationRef): IPagemarkDelete {
            return {
                type: 'delete',
                pageNum: annotationRef.pageNum,
                pagemark: annotationRef.original as IPagemark
            }
        }

        annotations.map(annotationMetaToRefResolver)
                   .map(toMutation)
                   .forEach(onPagemark);

    }

    const onDelete = (annotations: ReadonlyArray<IAnnotationMeta>) => {
        const selected = annotations.map(annotationMetaToRefResolver);
        annotationMutationsContext.onDeleted({selected});
    }

    const onCopy = () => {
        Clipboards.writeText(origin.selectionToText());
    }

    const onPagemarkSetMode = (annotation: IAnnotationMeta) => {

        function convertPagemarkModeToOption(mode: PagemarkMode): ISelectOption<PagemarkMode> {

            function createOption(mode: PagemarkMode, label?: string) {

                label = label || mode.replace(/_/g, " ");

                return {
                    id: mode,
                    label,
                    value: mode
                };

            }

            switch (mode) {

                case PagemarkMode.PRE_READ:
                    return createOption(mode, 'PREVIOUSLY READ')
                default:
                    return createOption(mode);

            }

        }

        const options: ReadonlyArray<ISelectOption<PagemarkMode>> =
            Object.values(PagemarkMode).map(convertPagemarkModeToOption)

        function onDone(selected: ISelectOption<PagemarkMode>) {

            const annotationRef = annotationMetaToRefResolver(annotation);

            onPagemark({
                type: 'update-mode',
                pageNum: annotation.pageNum,
                mode: selected.value,
                existing: annotationRef.original as IPagemark
            })
        }

        dialogManager.select({
            title: "Set Pagemark Mode",
            description: "Change the pagemark mode which impacts the color of the pagemark and how it impacts your reading progress.",
            options,
            onCancel: NULL_FUNCTION,
            onDone
        });
    }

    const onPagemarkForEntireDocument = () => {
        onPagemark({
            type: 'create-for-entire-document'
        });
    }

    const onRevealAnnotation = React.useCallback(() => {

        const highlights = [
            ...origin.areaHighlights,
            ...origin.textHighlights
        ];

        const highlight = Arrays.first(highlights);

        if (! highlight) {
            console.warn("No highlight");
            return;
        }

        if (! docDescriptor?.fingerprint) {
            console.warn("No doc descriptor fingerprint");
            return;
        }

        const {pageNum} = highlight;

        // TODO make sure the right doc panel is exposed

        const ptr = AnnotationPtrs.create({
            target: 'annotation-' + highlight.id,
            docID: docDescriptor.fingerprint,
            pageNum,
            pos: 'top'
        })

        console.log("Jumping to annotation on document: " + docDescriptor.fingerprint, docDescriptor);
        jumpToAnnotationHandler(ptr)

    }, [docDescriptor, jumpToAnnotationHandler, origin.areaHighlights, origin.textHighlights]);

    const isPDF = origin.fileType === 'pdf';

    return (
        <>
            {/*{origin.hasSelection &&*/}
            {/*    <MUIMenuItem text="Copy"*/}
            {/*                 icon={<AssignmentIcon/>}*/}
            {/*                 onClick={onCopy}/>}*/}

            <MUIMenuSubheader>Pagemarks</MUIMenuSubheader>

            <MUIMenuItem key="create-pagemark-to-current-location"
                         text="Pagemark to Current Location"
                         icon={<BookmarkIcon/>}
                         onClick={onCreatePagemarkToPoint}/>

            {origin.pageNum > 1 && (
                <MUIMenuItem key="create-pagemark-from-page-to-current-location"
                             text="Pagemark from Page To to Current Location"
                             icon={<BookmarksIcon/>}
                             onClick={onCreatePagemarkFromPage}/>)}

            <MUIMenuItem key="mark-entire-document-read"
                         text="Mark Entire Document as Read"
                         icon={<BookmarksIcon/>}
                         onClick={onPagemarkForEntireDocument}/>

            {(props.origin?.pagemarks?.length || 0) > 0 &&
                <MUIMenuItem key="set-pagemark-mode"
                             text="Label Pagemark"
                             icon={<BookmarkBorderIcon/>}
                             onClick={() => onPagemarkSetMode(origin.pagemarks[0])}/>}

            {(props.origin?.pagemarks?.length || 0) > 0 &&
                <MUIMenuItem key="delete-pagemark"
                             text="Delete Pagemark"
                             icon={<DeleteForeverIcon/>}
                             onClick={() => onDeletePagemark(origin.pagemarks)}/>}

            <MUIMenuSection title="Area Highlights">

                {isPDF &&
                    <MUIMenuItem key="create-area-highlight"
                                 text="Create Area Highlight"
                                 icon={<PhotoSizeSelectLargeIcon/>}
                                 onClick={onCreateAreaHighlight}/>}

                {(props.origin?.areaHighlights?.length || 0) > 0 && (
                    <MUIMenuItem key="area-highlight-reveal-in-annotation-sidebar"
                             text="Reveal in Annotation Sidebar"
                             icon={<CenterFocusStrongIcon/>}
                             onClick={onRevealAnnotation}/>
                )}

                {isPDF && (props.origin?.areaHighlights?.length || 0) > 0 &&
                    <MUIMenuItem key="delete-area-highlight"
                                 text="Delete Area Highlight"
                                 icon={<DeleteForeverIcon/>}
                                 onClick={() => onDelete(origin.areaHighlights)}/>}

            </MUIMenuSection>

            <MUIMenuSection title="Text Highlights">
                {(props.origin?.textHighlights?.length || 0) > 0 && (
                    <>
                        <MUIMenuItem key="text-highlight-reveal-in-annotation-sidebar"
                                     text="Reveal in Annotation Sidebar"
                                     icon={<CenterFocusStrongIcon/>}
                                     onClick={onRevealAnnotation}/>

                        <MUIMenuItem key="delete-text-highlight"
                                     text="Delete Text Highlight"
                                     icon={<DeleteForeverIcon/>}
                                     onClick={() => onDelete(origin.textHighlights)}/>
                    </>
                )}

            </MUIMenuSection>


        </>
    );

}
