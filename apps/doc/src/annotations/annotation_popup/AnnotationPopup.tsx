
import React from "react";
import {Box, createStyles, Grow, makeStyles, Popper} from "@material-ui/core";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {TextHighlightMerger} from "../../text_highlighter/TextHighlightMerger";
import {AnnotationTypes} from "../../../../../web/js/metadata/AnnotationTypes";
import {IPoint} from "../../../../../web/js/Point";
import {IDocScale, useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {DocAnnotations} from "../../../../../web/js/annotation_sidebar/DocAnnotations";
import {AnnotationPopupActionProvider} from "./AnnotationPopupActionContext";
import {AnnotationPopupBar} from "./AnnotationPopupBar";
import {AnnotationPopupActions} from "./AnnotationPopupActions";

export type HighlightBarData = {
    highlightID: string;
    type: AnnotationType.TEXT_HIGHLIGHT | AnnotationType.AREA_HIGHLIGHT;
    pageNum: number;
};

export const useAnnotationPopupStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
            background: theme.palette.background.default,
            borderRadius: 4,
        },
        barPadding: {
            padding: 8,
        },
        popperRoot: {
            zIndex: theme.zIndex.modal,
        },
    }),
);

type IAnnotationPopupRenderer = HighlightBarData & {
    docMeta: IDocMeta;
    docScale: IDocScale;
    annotation: IDocAnnotation;
};

export const AnnotationPopupRenderer: React.FC<IAnnotationPopupRenderer> = (props) => {
    const {fileType} = useDocViewerContext();
    const {pageNum, type, docScale, annotation} = props;
    const docViewerElementsContext = useDocViewerElementsContext();
    const [divRef, setDivRef] = React.useState<HTMLDivElement | null>(null);

    const classes = useAnnotationPopupStyles();

    const position: IPoint = React.useMemo(() => {
        const annotationObject = annotation.original;
        console.log('debug-----------', annotationObject);
        if (fileType === "epub") {
            return {x: 0, y: 0};
        }
        if (AnnotationTypes.isTextHighlight(annotationObject, type)) {
            const rect = Object.values(annotationObject.rects).reduce(TextHighlightMerger.mergeRects);
            const pageRect = docViewerElementsContext
                .getDocViewerElement()
                .querySelector(`.page[data-page-number="${pageNum}"]`)!
                .getBoundingClientRect();
            const viewerRect = docViewerElementsContext
                .getDocViewerElement()
                .querySelector("#viewer")!
                .getBoundingClientRect();
            return {
                x: (rect.left + rect.width / 2) * docScale.scaleValue + pageRect.left - viewerRect.left,
                y: (rect.top) * docScale.scaleValue + pageRect.top - viewerRect.top,
            };
        }

        return {x: 0, y: 0};
    }, [annotation, docScale]);

    return (
        <>
            <div ref={(ref) => setDivRef(ref)} id="fudge" style={{top: position.y, left: position.x, position: "absolute" }} />
            {divRef && (
                <Popper
                    placement="top"
                    open={true}
                    anchorEl={divRef}
                    className={classes.popperRoot}
                    popperOptions={{ eventsEnabled: false }}
                    modifiers={{
                        preventOverflow: {
                            enabled: false,
                            boundariesElement: 'scrollParent',
                        }
                    }}
                    disablePortal
                    transition
                >
                    {({TransitionProps}) => (
                        <Grow {...TransitionProps}>
                            <AnnotationPopupActionProvider annotation={annotation} type={type}>
                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    <AnnotationPopupActions />
                                    <AnnotationPopupBar />
                                </Box>
                            </AnnotationPopupActionProvider>
                        </Grow>
                    )}
                </Popper>
            )}
        </>
    );
};

const toAnnotation = (docMeta: IDocMeta, highlightBarData: HighlightBarData): IDocAnnotation | null => {
    const { type, highlightID, pageNum } = highlightBarData;
    if (type === AnnotationType.TEXT_HIGHLIGHT) {
        const textHighlight: ITextHighlight | undefined = docMeta.pageMetas[pageNum].textHighlights[highlightID];
        // TODO REVIEW: textHighlight should be ITextHighlight | undefined but it's not because of the type
        if (textHighlight) {
            return DocAnnotations.createFromTextHighlight(docMeta, textHighlight, docMeta.pageMetas[pageNum]);
        }
    }
    return null;
};

export const AnnotationPopup: React.FC = () => {
    const {docMeta, docScale, highlightBar}
        = useDocViewerStore(['docMeta', 'docScale', 'highlightBar']);
    const {setHighlightBar} = useDocViewerCallbacks();

    const annotation: IDocAnnotation | null = React.useMemo(() => {
        if (docMeta && highlightBar) {
            const annotation = toAnnotation(docMeta, highlightBar);
            // If highlightBar isn't null and there's no annotation that means it got deleted
            if (highlightBar && !annotation) {
                setHighlightBar(null);
            }
            return annotation;
        }
        return null;
    }, [highlightBar, docMeta]);

    if (docMeta && annotation && docScale && highlightBar && annotation) {
        return (
            <AnnotationPopupRenderer
                docMeta={docMeta}
                docScale={docScale}
                annotation={annotation}
                {...highlightBar}
            />
        );
    }
    return null;
};
