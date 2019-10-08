import {Rect} from "../../../../Rect";
import {Rects} from "../../../../Rects";
import {LineAdjustment} from "./LineAdjustment";
import {Line} from "../../../../util/Line";
import {Adjacency} from "./Adjacency";
import {Preconditions} from 'polar-shared/src/Preconditions';

/**
 * If we have two rects, and the've moved to intersect, compute updated
 * positions so that they are ADJACENT, not intersecting.
 */
export class DragRectAdjacencyCalculator {

    /**
     *
     * @param primaryRect {Rect} The primary rect that is moving and is
     *     intersecting with the secondary rect.  The primary rect is the one
     *     we want to adjust.
     *
     * @param secondaryRect {Rect} The stationary rect that we need to keep our
     *     rect adjacent too.
     * @param [restrictionRect] {Rect} Limit the movement to the given rect.
     *
     * @return {Adjacency} Return the new / correct position of the primary
     *     rect.
     */
    public static calculate(primaryRect: Rect, secondaryRect: Rect, restrictionRect?: Rect) {

        Preconditions.assertPresent(primaryRect, "primaryRect");
        Preconditions.assertPresent(secondaryRect, "secondaryRect");

        const result = new Adjacency();

        if (!restrictionRect) {

            // define a HUGE rect to work within by default.  Mathematically, we
            // should probably use infinity and negative infinity but working
            // with these in Javascript + JSON is limited.

            restrictionRect = Rects.createFromBasicRect({
                left: -1000000,
                top: -1000000,
                bottom: 1000000,
                right: 1000000
            });

        }

        result.primaryRect = Rects.validate(primaryRect);
        result.secondaryRect = Rects.validate(secondaryRect);

        const secondaryBox = {
            horizontal: new Line(secondaryRect.left, secondaryRect.right),
            vertical: new Line(secondaryRect.top, secondaryRect.bottom)
        };

        const primaryBox = {
            horizontal: new Line(primaryRect.left, primaryRect.right),
            vertical: new Line(primaryRect.top, primaryRect.bottom)
        };

        const restrictionBox = {
            horizontal: new Line(restrictionRect.left, restrictionRect.right),
            vertical: new Line(restrictionRect.top, restrictionRect.bottom)
        };

        // TODO: it might be better to create a LineSet of vertical and
        // horizontal and then pass them to adjust.

        Preconditions.assertPresent(primaryBox, "primaryBox");
        Preconditions.assertPresent(secondaryBox, "secondaryBox");
        Preconditions.assertPresent(restrictionBox, "restrictionBox");

        result.adjustments.horizontal
            = DragRectAdjacencyCalculator.adjust(primaryBox.horizontal, secondaryBox.horizontal, restrictionBox.horizontal, "x");

        result.adjustments.vertical
            = DragRectAdjacencyCalculator.adjust(primaryBox.vertical, secondaryBox.vertical, restrictionBox.vertical, "y");

        let successfulAdjustments = [result.adjustments.horizontal, result.adjustments.vertical];

        // we only want to factor in where we actually overlapped.
        successfulAdjustments = successfulAdjustments.filter(current => current.overlapped === true);

        // now sort the adjustments so that ones with a lower delta are first.
        successfulAdjustments = successfulAdjustments.sort((adj0, adj1) => adj0.delta - adj1.delta);

        if (successfulAdjustments.length >= 1) {
            result.adjustment = successfulAdjustments[0];
            result.adjustedRect = result.adjustment.adjustRect(primaryRect);
        }

        return result;

    }

    /**
     * Adjust the line and return the required adjustment, or null if no
     * adjustment is needed.
     *
     */
    public static adjust(primaryLine: Line, secondaryLine: Line, restrictionLine: Line, axis: 'x' | 'y') {

        // there were no matches.
        const none = new LineAdjustment({
            axis,
            overlapped: false,
            start: primaryLine.start,
            snapped: null
        });

        let result = none;

        if (secondaryLine.overlaps(primaryLine) || primaryLine.overlaps(secondaryLine)) {

            let results = [];

            results.push(LineAdjustment.create({
                axis,
                start: secondaryLine.end,
                previous: primaryLine.start,
                snapped: "AFTER"
            }));

            results.push(LineAdjustment.create({
                axis,
                start: secondaryLine.start - primaryLine.width,
                previous: primaryLine.start,
                snapped: "BEFORE"
            }));

            // filter out results that would be invalid due to the restriction
            // line.
            results = results.filter( result => {

                if (result.start < restrictionLine.start) {
                    return false;
                }

                if ((result.start + primaryLine.width) > restrictionLine.end) {
                    return false;
                }

                return true;

            });

            results = results.sort((r0, r1) => r0.delta - r1.delta);

            // console.log(`DEBUG: results for ${axis} axis: ` +
            // JSON.stringify(results, null, "  "));

            if (results.length > 0 ) {
                result = results[0];
            }

        }

        // console.log(`DEBUG: Final result for ${axis} axis: ` +
        // JSON.stringify(result, null, "  "));

        return result;

    }

}
