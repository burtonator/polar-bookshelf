import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rect} from '../Rect';
import {AnnotationRect} from './AnnotationRect';
import {Line} from '../util/Line';
import {Rects} from '../Rects';
import {IDimensions} from "../util/IDimensions";
import {IPoint} from "../Point";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IRect} from 'polar-shared/src/util/rects/IRect';

export namespace AnnotationRects {

    export function computeContainerDimensions(element: HTMLElement): IDimensions {

        return {
            width: element.clientWidth,
            height: element.clientHeight
        }

    }

    export function getPageElementAtPoint(point: IPoint): HTMLElement | undefined {

        const elements = document.elementsFromPoint(point.x, point.y)
                                 .filter(element => element.matches(".page"));

        if (elements.length === 1) {
            return elements[0] as HTMLElement;
        }

        return undefined;

    }

    export function getPageElement(page: number, docViewerElem: HTMLElement): HTMLElement | undefined {
        return docViewerElem.querySelectorAll(".page")[page - 1] as HTMLElement || undefined;
    }

    export function getPageElementDimensions(page: number, docViewerElem: HTMLElement): IDimensions | undefined {

        const pageElement = getPageElement(page, docViewerElem);

        if (! pageElement) {
            return undefined;
        }

        return computeContainerDimensions(pageElement);

    }

    export function createFromPointWithinPageElement(pageNum: number, rect: ILTRect, docViewerElem: HTMLElement) {

        const pageElement = getPageElement(pageNum, docViewerElem);

        if (pageElement) {
            const containerDimensions = computeContainerDimensions(pageElement);
            return createFromRectWithinPageAndContainer(rect, containerDimensions)
        }

        throw new Error("No page found at point");

    }

    export function createFromOverlayRect(pageNum: number, overlayRect: ILTRect, docViewerElem: HTMLElement) {

        const pageElement = getPageElement(pageNum, docViewerElem);

        if (pageElement) {
            const containerDimensions = computeContainerDimensions(pageElement);
            return createFromOverlayRectWithinPageAndContainer(overlayRect, containerDimensions)
        }

        throw new Error("No page found at point");

    }

    /**
     * Create from clientX and clientY point
     */
    export function createFromRectWithinPageAndContainer(rect: ILTRect, containerDimensions: IDimensions) {

        const boxRect = Rects.createFromBasicRect(rect);

        return createFromOverlayRectWithinPageAndContainer(boxRect, containerDimensions);

    }

    /**
     * Create from clientX and clientY point
     */
    export function createFromOverlayRectWithinPageAndContainer(overlayRect: ILTRect,
                                                                containerDimensions: IDimensions) {
        return AnnotationRects.createFromPositionedRect(Rects.createFromBasicRect(overlayRect), containerDimensions);
    }

    /**
     * Create a new AnnotationRect from a positioned rect.  We use this to take
     * a dragged or resized rect / box on the screen then convert it to a
     * PagemarkRect with the correct coordinates.
     *
     * @param boxRect {Rect}
     * @param containerDimensions {Rect}
     * @return {AnnotationRect}
     */
    export function createFromPositionedRect(boxRect: Rect, containerDimensions: IDimensions): AnnotationRect {

        Preconditions.assertCondition(boxRect.width > 0, 'boxRect width');
        Preconditions.assertCondition(boxRect.height > 0, 'boxRect height');

        Preconditions.assertCondition(containerDimensions.width > 0, 'containerRect width: ' + containerDimensions.width);
        Preconditions.assertCondition(containerDimensions.height > 0, 'containerRect height: ' + containerDimensions.height);

        Preconditions.assertInstanceOf(boxRect, Rect, "boxRect");

        const xAxis = boxRect.toLine("x").multiply(100 / containerDimensions.width);
        const yAxis = boxRect.toLine("y").multiply(100 / containerDimensions.height);

        return AnnotationRects.createFromLines(xAxis, yAxis);

    }

    /**
     *
     * @param xAxis {Line}
     * @param yAxis {Line}
     * @return {AnnotationRect}
     */
    export function createFromLines(xAxis: Line, yAxis: Line) {
        return AnnotationRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }

    /**
     *
     *
     * @param rect {Rect}
     * @return {AnnotationRect}
     */
    export function createFromRect(rect: Rect) {

        return new AnnotationRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

}
