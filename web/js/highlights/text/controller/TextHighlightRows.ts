import {Preconditions} from "polar-shared/src/Preconditions";

import {elementOffset, Styles} from "../../../utils";
import {Objects} from "../../../util/Objects";
import {RectElement} from "./RectElement";
import {TextHighlightRow} from "./TextHighlightRow";
import {IntermediateRow} from "./IntermediateRow";
import {Rects} from "../../../Rects";
import {DocFormatFactory} from "../../../docformat/DocFormatFactory";
import {Elements} from "../../../util/Elements";
import {createSiblingTuples} from "polar-shared/src/util/Functions";
import {MutableIRect} from "polar-shared/src/util/rects/IRect";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";

/**
 * TODO:
 *
 * I designed this incorrectly and should refactor it into a problem of geometry.
 *
 * What I need to do is form this into a polygon with points decorating the polygon.
 *
 * Then I need to take the outlier points, which contain all the points inside
 * the plane, then break it down into rows by looking down the polygon vertically
 * and bisecting it until it forms a collection of rectangles.
 *
 * The code for this would be a LOT cleaner and I think less error prone.
 *
 * This wasn't immediately evident because I was thinking about the problem
 * as a stream of text, not of geometric points.
 *
 */
export class TextHighlightRows {

    /**
     * Create a highlight from a CSS selector.
     */
    static createFromSelector(selector: string) {

        let docFormat = DocFormatFactory.getInstance();

        let targetDocument = docFormat.targetDocument();

        let elements = Array.from(targetDocument!.querySelectorAll(selector));

        if(! elements) {
            throw new Error("No elements");
        }

        let rectElements = elements.map(current => this.computeOffset(<HTMLElement> current));

        //console.log("Working with raw rectElements: ", rectElements);

        return TextHighlightRows.computeContiguousRects(rectElements);

    }

    /**
     * Create the rows from the given rects
     *
     * @param selector
     * @return {Array}
     */
    static createFromRects(selector: string) {

        // FIXME: this isn't working yet...
        //

        // let rectElements = elements.map(current => this.computeOffset(current));
        //
        // //console.log("Working with raw rectElements: ", rectElements);
        //
        // return TextHighlightRows.computeContiguousRects(rectElements);

    }

    /**
     * Given the span of our highlight, compute the offset looking at the CSS
     * styles of the element we're trying to map.
     *
     * @param element The element which we're computing over.
     * @return A RectElement for the rect (result) and the element
     */
    static computeOffset(element: HTMLElement) {

        let docFormat = DocFormatFactory.getInstance();

        // make sure we're working on the right element or our math won't be right.
        Elements.requireClass(element, "text-highlight-span");

        let textHighlightSpanOffset: ILTRect = Elements.offset(element);

        if(docFormat.name === "html") {

            // FIXME: getBoundingClientRect doesn't take into consideration
            // transforms and when scaled we're getting the wrong positions..

            // FIXME: also , this only works for the html version because the
            // iframe doesn't scroll.  getBoundingClientRect is relative to the
            // viewport.

            // TODO: sit down and REALLY understand getBoundingClientRect and
            // getClientRects as well as offsetLeft,offsetTop (and friends).
            // I think, in retrospect, that I'm computing all of these wrong.
            // I think I need to use getBoundingClientRect() and not offset
            // but the PDF viewer uses transforms which is confusing.
            textHighlightSpanOffset = element.getBoundingClientRect();
        }

        let textLayerDivElement = element.parentElement;

        let textLayerDivOffset = elementOffset(textLayerDivElement);
        let rect: MutableIRect = textLayerDivOffset;

        if(docFormat.name === "html") {

            // FIXME this should go into a docFormat.computeAnnotationOrigin(element)
            // which for iframes should just be the document offset but for
            // PDFs should be the offset of the textElement.

            rect = {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                bottom: 0,
                right: 0
            };

        }


        // FIXME: we should also parse scaleY and scale here. Normally scaleY
        // would be zero which would work with the PDF viewer.
        //
        // FIXME: and couldn't another way to deal with this be to place these
        // into either the textLayerDivElement or my own annotationsDivElement
        // which has the same transform?
        let scaleX = Styles.parseTransformScaleX(textLayerDivElement!.style.transform);
        if(! scaleX) {
            // FIXME: return 1.0 from parseTransformScaleX
            scaleX = 1.0;
        }

        rect.left = rect.left + (textHighlightSpanOffset.left * scaleX);
        rect.top = rect.top + textHighlightSpanOffset.top;

        rect.height = textHighlightSpanOffset.height;
        rect.width = textHighlightSpanOffset.width * scaleX;

        rect.width = Math.min(rect.width, textLayerDivOffset.width);

        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;

        rect = Rects.validate(rect);

        // the result needs to factor in the current scale vs the reference
        // scale of 1.0.  We always store / reference the highlights in a scale
        // of 1.0 and then adjust them based on the current view.

        let currentScale = docFormat.currentScale();

        Preconditions.assertNotNull(currentScale, "currentScale");
        Preconditions.assertNumber(currentScale, "currentScale");

        rect = Rects.scale(rect, 1.0 / currentScale);

        return new RectElement(rect, element);

    }

    /**
     * Go through ALL the rects and build out rows of elements that are
     * horizontally all on the same plane.
     *
     * @param rectElements
     */
    static computeRows(rectElements: any) {

        let tuples = createSiblingTuples(rectElements);

        let result = [];

        // the current row
        let row: any[] = [];

        tuples.forEach(function (tuple: any) {

            if(!tuple.curr.rect) {
                throw new Error("Not a RectElement");
            }

            row.push(tuple.curr);

            if(tuple.next == null || (tuple.next && tuple.curr.rect.top !== tuple.next.rect.top)) {
                result.push(row);
                row = [];
            }

        });

        if (row.length !== 0)
            result.push(row);

        return result;

    }

    // given a row of rects, compute a rect that covers the entire row maximizing
    // the height and width.
    static computeRectForRow(row: any) {

        if (row.length == null || row.length === 0)
            throw new Error("Invalid row data");

        // duplicate the first entry... we will keep maximizing the bounds.
        let result = Rects.validate(Objects.duplicate(row[0].rect));

        row.forEach(function (rectElement: any) {

            if(rectElement.rect.left < result.left) {
                result.left = rectElement.rect.left;
            }

            if(rectElement.rect.top < result.top) {
                result.top = rectElement.rect.top;
            }

            if(rectElement.rect.bottom > result.bottom) {
                result.bottom = rectElement.rect.bottom;
            }

            if(rectElement.rect.right > result.right) {
                result.right = rectElement.rect.right;
            }

            result.width = result.right - result.left;
            result.height = result.bottom - result.top;

        });

        return Rects.validate(result);

    }

    static computeIntermediateRows(rectElements: any) {

        let rows = TextHighlightRows.computeRows(rectElements)
        let result: any[] = [];

        rows.forEach(function (rectElementsWithinRow) {
            let rect = TextHighlightRows.computeRectForRow(rectElementsWithinRow);
            let intermediateRow = new IntermediateRow(rect, rectElementsWithinRow);
            result.push(intermediateRow);
        });

        return result;

    }

    static computeContiguousRects(rectElements: any[]) {

        let intermediateRows = TextHighlightRows.computeIntermediateRows(rectElements);

        let intermediateRowPager = createSiblingTuples(intermediateRows);

        let result: any[] = [];

        intermediateRowPager.forEach(function (page: any) {

            if(!page.curr.rect || !page.curr.rectElements) {
                throw new Error("Not a IntermediateRow");
            }

            let adjustedRect = {
                left: page.curr.rect.left,
                top: page.curr.rect.top,
                right: page.curr.rect.right,
                bottom: page.curr.rect.bottom,
                width: 0,
                height: 0
            };

            // adjust the bottom of this div but ONLY if the next div is not on
            // the same rows.  I might need to have some code to first build
            // this into ROWS.

            if(page.next && page.next.rect.top !== page.curr.rect.top) {
                adjustedRect.bottom = Math.max(page.next.rect.top, adjustedRect.bottom);
            }

            adjustedRect.width = adjustedRect.right - adjustedRect.left;
            adjustedRect.height = adjustedRect.bottom - adjustedRect.top;

            adjustedRect = Rects.validate(adjustedRect);

            let textHighlightRow = new TextHighlightRow(adjustedRect, page.curr.rectElements);

            result.push(textHighlightRow);

        });

        return result;

    }

}
