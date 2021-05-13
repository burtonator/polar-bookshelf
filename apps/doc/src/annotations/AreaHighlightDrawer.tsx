import React from "react";
import {IPoint} from '../../../../web/js/Point';
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {ControlledAnnotationBars} from '../../../../web/js/ui/annotationbar/ControlledAnnotationBars';
import {Elements} from '../../../../web/js/util/Elements';
import {createStyles, makeStyles} from '@material-ui/core';
import {useAreaHighlightHooks} from '../annotations/AreaHighlightHooks';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {useDocViewerCallbacks, useDocViewerStore} from '../DocViewerStore';
import {useDocViewerElementsContext} from '../renderers/DocViewerElementsContext';
import {useRefWithUpdates} from "../../../../web/js/hooks/ReactHooks";

const useAreaHighlightCreatorStyles = makeStyles(() =>
    createStyles({
        viewerContainer: {
            "& .page *, & .page": {
                cursor: "crosshair!important",
            },
        },
    }),
);

export const AreaHighlightCreator: React.FC = () => {
    const {areaHighlightMode} = useDocViewerStore(["areaHighlightMode"]);
    const {onAreaHighlightCreated} = useAreaHighlightHooks();
    const {toggleAreaHighlightMode} = useDocViewerCallbacks();
    const docViewerElements = useDocViewerElementsContext();
    const classes = useAreaHighlightCreatorStyles();

    React.useEffect(() => {
        const viewerContainer = docViewerElements.getDocViewerElement().querySelector("#viewerContainer");
        if (viewerContainer) {
            viewerContainer.classList[areaHighlightMode ? "add" : "remove"](classes.viewerContainer);
        }
    }, [areaHighlightMode, docViewerElements, classes]);

    const createAreaHighlight = React.useCallback(({ rect, pageNum }) => {
        onAreaHighlightCreated({ pageNum, rectWithinPageElement: rect });
        if (areaHighlightMode) {
            toggleAreaHighlightMode();
        }
    }, [onAreaHighlightCreated, areaHighlightMode, toggleAreaHighlightMode])

    usePDFRectangleDrawer(createAreaHighlight, { enabled: areaHighlightMode });

    return null;
};

type IUsePDFRectangleDrawerCallback = (data: { pageNum: number, rect: ILTRect }) => void;
type IUsePDFRectangleDrawerOpts = {
    threshold?: IPoint;
    enabled?: boolean;
};

const useStyles = makeStyles(() =>
    createStyles({
        viewerContainer: {
            "& .page *, & .page": {
                cursor: "crosshair!important",
            },
        },
        rect: {
            pointerEvents: "none",
            position: "absolute",
            zIndex: 10,
            background: "rgba(255, 255, 0, 0.5)",
            mixBlendMode: "multiply",
            border: "1px solid rgb(198, 198, 198)",
        },
    }),
);

const rangeConstrain = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

const calculateRectDimensions = (start: IPoint, position: IPoint, pageRect: ClientRect): ILTRect => {
    const {x, y} = getRelativePosition(position, pageRect);
    const w = rangeConstrain(x - start.x, -start.x, pageRect.width - start.x);
    const h = rangeConstrain(y - start.y, -start.y, pageRect.height - start.y);
    return {
        top: Math.min(start.y, start.y + h),
        left: Math.min(start.x, start.x + w),
        width: Math.abs(w),
        height: Math.abs(h),
    };
};

const getRelativePosition = (position: IPoint, pageRect: IRect): IPoint => ({
    x: position.x - pageRect.left,
    y: position.y - pageRect.top,
});


const updateDOMRect = (rectElem: HTMLDivElement, { top, left, width, height }: ILTRect): void => {
    rectElem.style.top = `${top}px`;
    rectElem.style.left = `${left}px`;
    rectElem.style.width = `${width}px`;
    rectElem.style.height = `${height}px`;
};

export const usePDFRectangleDrawer = (callback: IUsePDFRectangleDrawerCallback, opts?: IUsePDFRectangleDrawerOpts) => {
    const {threshold = { x: 20, y: 20 }, enabled = true} = opts || {};
    const docViewerElementsRef =  useRefWithUpdates(useDocViewerElementsContext());
    const classes = useStyles();
    const callbackRef = useRefWithUpdates(callback);

    React.useEffect(() => {
        if (!enabled) {
            return;
        }
        let start: IPoint | undefined = undefined;
        let pageRect: IRect | undefined;
        let pageElement: HTMLElement | undefined;
        let rectElem: HTMLDivElement | undefined;


        const init = (target: EventTarget | null, position: IPoint): boolean => {
            if (target && target instanceof HTMLElement) {
                pageElement = Elements.untilRoot(target, ".page") as HTMLDivElement;
                if (pageElement) {
                    rectElem = document.createElement("div");
                    pageElement.appendChild(rectElem);
                    pageRect = pageElement.getBoundingClientRect();
                    const pageStyles = window.getComputedStyle(pageElement);
                    const border = {
                        top: +pageStyles.borderTopWidth.slice(0, -2),
                        left: +pageStyles.borderLeftWidth.slice(0, -2),
                        bottom: +pageStyles.borderBottomWidth.slice(0, -2),
                        right: +pageStyles.borderRightWidth.slice(0, -2),
                    };
                    pageRect = {
                        ...pageRect,
                        left: pageRect.left + border.left,
                        top: pageRect.top + border.top,
                        width: pageRect.width - border.left - border.right,
                        height: pageRect.height - border.top - border.bottom,
                    };
                    rectElem.classList.add(classes.rect);
                    start = getRelativePosition(position, pageRect);
                    return true;
                }
            }
            return false;
        };
        
        const cleanup = (endPosition: IPoint) => {
            if (!pageElement || !rectElem || !start || !pageRect) {
                return;
            }

            const rect = calculateRectDimensions(start, endPosition, pageRect);
            pageElement.removeChild(rectElem);
            if (rect.width > threshold.x || rect.height > threshold.y) {
                callbackRef.current({
                    rect,
                    pageNum: parseInt(pageElement.getAttribute("data-page-number")!),
                });
            }
            start = pageRect = pageElement = rectElem = undefined;
        };

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (init(e.target, { x: e.clientX, y: e.clientY })) {
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp, {once: true});
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!start || !pageRect || !rectElem) {
                return;
            }
            e.preventDefault();
            const rect = calculateRectDimensions(start, { x: e.clientX, y: e.clientY }, pageRect);
            updateDOMRect(rectElem, rect);
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener("mousemove", handleMouseMove);
            cleanup({ x: e.clientX, y: e.clientY });
        };

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.touches.length === 1) {
                const master = e.touches[0];
                if (init(e.target, { x: master.clientX, y: master.clientY })) {
                    window.addEventListener("touchmove", handleTouchMove);
                    window.addEventListener("touchend", handleTouchEnd, {once: true});
                }
            }
        };

        let lastPosition: IPoint;

        const handleTouchMove = (e: TouchEvent) => {
            if (!start || !pageRect || !rectElem) {
                return;
            }
            e.preventDefault();
            const touch = e.touches[e.touches.length - 1];
            lastPosition = { x: touch.clientX, y: touch.clientY };
            const rect = calculateRectDimensions(start, lastPosition, pageRect);
            updateDOMRect(rectElem, rect);
        };

        const handleTouchEnd = () => {
            window.removeEventListener("touchmove", handleTouchMove);
            cleanup(lastPosition);
        };

        const targets = ControlledAnnotationBars
            .computeTargets("pdf", docViewerElementsRef.current.getDocViewerElement);

        for (let target of targets) {
            target.addEventListener("mousedown", handleMouseDown);
            target.addEventListener("touchstart", handleTouchStart);
        }

        return () => {
            for (let target of targets) {
                target.removeEventListener("mousedown", handleMouseDown);
                target.removeEventListener("touchstart", handleTouchStart);
            }
        };
    }, [enabled, classes, callbackRef, threshold, docViewerElementsRef]);
};
