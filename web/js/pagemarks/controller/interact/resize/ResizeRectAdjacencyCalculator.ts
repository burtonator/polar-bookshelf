import {Rect} from '../../../../Rect';
import {Line} from '../../../../util/Line';
import {LineEdges} from '../edges/LineEdges';
import {RectEdges} from '../edges/RectEdges';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Objects} from '../../../../util/Objects';
import {Rects} from '../../../../Rects';

export class ResizeRectAdjacencyCalculator {

    /**
     *
     * @param resizeRect {Rect} The Rect that the user is resizing and hasn't
     * been accepted yet.
     *
     * @param intersectedRect {Rect} The rect we've intersected with.
     *
     * @param rectEdges {RectEdges} The rectEdges that are being resized.
     *
     */
    public calculate(resizeRect: Rect, intersectedRect: Rect, rectEdges: RectEdges) {

        Preconditions.assertPresent(rectEdges, "rectEdges");

        // console.log("DEBUG ResizeRectAdjacencyCalculator.calculate: resizeRect: " + JSON.stringify(resizeRect, null, "  "));
        // console.log("DEBUG ResizeRectAdjacencyCalculator.calculate: intersectedRect: " + JSON.stringify(intersectedRect, null, "  "));
        // console.log("DEBUG ResizeRectAdjacencyCalculator.calculate: rectEdges: " + JSON.stringify(rectEdges, null, "  "));

        // compute the intersection of the two rects.
        const intersectionRect = Rects.intersection(resizeRect, intersectedRect);

        // console.log("DEBUG: intersectionRect: " + JSON.stringify(intersectionRect, null, "  "));

        // TODO: we can refactor this to pass __adjustLine the axis and then call
        // toLine(axis) on each rect inside _adjustRect.

        let resizeLines = [];

        if (rectEdges.left || rectEdges.right) {
            resizeLines.push(resizeRect.toLine("x"));
        }

        if (rectEdges.top || rectEdges.bottom) {
            resizeLines.push(resizeRect.toLine("y"));
        }

        // Now sort the lines by their length to see which one we should use.
        // We should pick the longest line and adjust by that.

        resizeLines = resizeLines.sort((a, b) => a.length - b.length);

        // they should be descending.  I could change the sort algorithm but
        // I think the code is more clear that we want descending this way.
        // resizeLines = resizeLines.reverse();

        // console.log("DEBUG: resizeLines: " + JSON.stringify(resizeLines, null, "  "));

        const resizeLine = resizeLines[0];

        // console.log("DEBUG: resizeLine: " + JSON.stringify(resizeLine, null, "  "));

        // resize based on the larger axis now.
        if (resizeLine.axis === "x") {
            // console.log("Resizing X axis");
            return this.__adjustLine(intersectionRect.toLine("x"), resizeRect.toLine("x"), rectEdges.toLineEdges("x"), resizeRect);
        } else if (resizeLine.axis === "y") {
            // console.log("Resizing Y axis");
            return this.__adjustLine(intersectionRect.toLine("y"), resizeRect.toLine("y"), rectEdges.toLineEdges("y"), resizeRect);
        } else {
            throw new Error("Wrong axis: " + resizeLine.axis);
        }

    }

    /**
     *
     */
    private __adjustLine(intersectionLine: Line, resizeLine: Line, lineEdges: LineEdges, resizeRect: Rect) {

        // the rect that we are going to adjust and then use in the UI.
        const adjustedRect = new Rect(resizeRect);

        const adjustedLine = Objects.duplicate(resizeLine);

        if (lineEdges.start) {
            adjustedLine.start = intersectionLine.end;
        } else {
            adjustedLine.end = intersectionLine.start;
        }

        // technically we have to adjust the width of the line but the width
        // accessor on Line computes it for us.

        return adjustedRect.adjustAxis(adjustedLine);

    }

}
