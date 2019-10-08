import {ContextMenuLocation} from '../contextmenu/ContextMenuLocation';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rect} from '../Rect';
import {AnnotationRect} from './AnnotationRect';
import {Line} from '../util/Line';
import {Rects} from '../Rects';
const log = Logger.create();

export class AnnotationRects {

    /**
     *
     * @param contextMenuLocation {ContextMenuLocation}
     */
    static createFromEvent(contextMenuLocation: ContextMenuLocation) {

        let points = contextMenuLocation.points;

        let elements = document.elementsFromPoint(points.client.x, points.client.y);

        elements = elements.filter(element => element.matches(".page"));

        if (elements.length === 1) {

            let pageElement = <HTMLElement>elements[0];

            log.info("Creating box on pageElement: ", pageElement);

            // get the point within the element itself..
            let pageElementPoint = points.pageOffset;

            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });

            log.info("Placing box at: ", boxRect);

            // get a rect for the element... we really only need the dimensions
            // though.. not the width and height.
            let containerRect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: pageElement.offsetWidth,
                height: pageElement.offsetHeight
            });

            return AnnotationRects.createFromPositionedRect(boxRect, containerRect);

        }

        throw new Error("Wrong number of .page elements: " + elements.length);

    }

    /**
     * Create a new AnnotationRect from a positioned rect.  We use this to take
     * a dragged or resized rect / box on the screen then convert it to a
     * PagemarkRect with the correct coordinates.
     *
     * @param boxRect {Rect}
     * @param containerRect {Rect}
     * @return {AnnotationRect}
     */
    static createFromPositionedRect(boxRect: Rect, containerRect: Rect): AnnotationRect {

        Preconditions.assertInstanceOf(boxRect, Rect, "boxRect");

        let xAxis = boxRect.toLine("x").multiply(100 / containerRect.width);
        let yAxis = boxRect.toLine("y").multiply(100 / containerRect.height);

        return AnnotationRects.createFromLines(xAxis, yAxis);

    }

    /**
     *
     * @param xAxis {Line}
     * @param yAxis {Line}
     * @return {AnnotationRect}
     */
    static createFromLines(xAxis: Line, yAxis: Line) {
        return AnnotationRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }

    /**
     *
     *
     * @param rect {Rect}
     * @return {AnnotationRect}
     */
    static createFromRect(rect: Rect) {

        return new AnnotationRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

}
