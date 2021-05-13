import * as React from "react";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {computePageDimensions} from "./AnnotationHooks";
import {AreaHighlightRects} from "../../../../web/js/metadata/AreaHighlightRects";
import * as ReactDOM from "react-dom";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AreaHighlightRect} from "../../../../web/js/metadata/AreaHighlightRect";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {ResizeBox} from "./ResizeBox";
import {useDocViewerStore} from "../DocViewerStore";
import {useAreaHighlightHooks} from "./AreaHighlightHooks";
import {IDocMetas} from "polar-shared/src/metadata/IDocMetas";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly areaHighlight: IAreaHighlight;
    readonly container: HTMLElement;
}

export const AreaHighlightRenderer = deepMemo(function AreaHighlightRenderer(props: IProps) {

    const {areaHighlight, fingerprint, pageNum, container} = props;
    const {id} = areaHighlight;
    const {docMeta, docScale} = useDocViewerStore(['docMeta', 'docScale']);
    const {onAreaHighlightUpdated} = useAreaHighlightHooks();
    const docViewerElementsContext = useDocViewerElementsContext();

    const pageElement = docViewerElementsContext.getPageElementForPage(pageNum);

    const [draggable, setDraggable] = React.useState(false);

    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
                setDraggable(true);
            } else {
                setDraggable(false);
            }
        };
        window.addEventListener('keydown', handleKey, {passive: true});
        window.addEventListener('keyup', handleKey, {passive: true});
        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('keyup', handleKey);
        };
    }, [setDraggable]);

    const toOverlayRect = React.useCallback((areaHighlightRect: AreaHighlightRect): ILTRect | undefined => {

        if (! pageElement) {
            return undefined;
        }

        if (! docScale) {
            return undefined;
        }

        const {scaleValue} = docScale;

        const pageDimensions = computePageDimensions(pageElement);

        if (areaHighlight.position) {

            const overlayRect = {
                left: areaHighlight.position.x,
                top: areaHighlight.position.y,
                width: areaHighlight.position.width,
                height: areaHighlight.position.height
            };

            return Rects.scale(Rects.createFromBasicRect(overlayRect), scaleValue);

        }

        // This is for OLDER area highlights but these will be deprecated
        // pretty soon as they're not really used very much I imagine.

        return areaHighlightRect.toDimensions(pageDimensions);

    }, [areaHighlight.position, docScale, pageElement]);

    const handleRegionResize = React.useCallback((overlayRect: ILTRect) => {

        // get the most recent area highlight as since this is using state
        // we have can have a stale highlight.

        const pageMeta = IDocMetas.getPageMeta(docMeta!, pageNum);
        const areaHighlight = (pageMeta.areaHighlights || {})[id];

        onAreaHighlightUpdated({areaHighlight, pageNum, overlayRect});

        return undefined;

    }, [docMeta, pageNum, id, onAreaHighlightUpdated]);

    const createID = React.useCallback(() => {
        return `area-highlight-${areaHighlight.id}`;
    }, [areaHighlight]);

    const toReactPortal = React.useCallback((rect: IRect, container: HTMLElement) => {

        const areaHighlightRect = AreaHighlightRects.createFromRect(rect);
        const overlayRect = toOverlayRect(areaHighlightRect);

        if (! overlayRect) {
            return null;
        }

        const id = createID();

        const className = `area-highlight annotation area-highlight-${areaHighlight.id}`;

        const color: HighlightColor = areaHighlight.color || 'yellow';
        const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

        return ReactDOM.createPortal(
            <ResizeBox
                 id={id}
                 data-type="area-highlight"
                 draggable={draggable}
                 data-doc-fingerprint={fingerprint}
                 data-area-highlight-id={areaHighlight.id}
                 data-annotation-id={areaHighlight.id}
                 data-page-num={pageNum}
                 // annotation descriptor metadata - might not be needed
                 // anymore
                 data-annotation-type="area-highlight"
                 data-annotation-page-num={pageNum}
                 data-annotation-doc-fingerprint={fingerprint}
                 data-annotation-color={color}
                 className={className}
                 computePosition={() => overlayRect}
                 style={{
                     position: 'absolute',
                     backgroundColor,
                     mixBlendMode: 'multiply',
                     border: `1px solid #c6c6c6`,
                     zIndex: 1
                 }}
                 onResized={handleRegionResize}
                 />,
            container,
            id);

    }, [areaHighlight, createID, fingerprint, handleRegionResize, pageNum, toOverlayRect, draggable]);

    // const rect = Arrays.first(Object.values(areaHighlight.rects));
    //
    // if (rect) {
    //     return toReactPortal(rect, container)
    // } else {
    //     return null;
    // }

    const portals = Object.values(areaHighlight.rects)
        .map(current => toReactPortal(current, container));

    return (
        <>
            {portals}
        </>
    );

});
