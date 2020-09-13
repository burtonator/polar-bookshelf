import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Rects} from "../Rects";
import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Numbers} from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Preconditions} from "polar-shared/src/Preconditions";

export namespace Highlights {

    export interface IViewportPosition {
        readonly top: number;
        readonly left: number;
        readonly width: number;
        readonly height: number;
    }

    export interface IHighlightNode {
        readonly node: Node;
        readonly nodeID: number;
        readonly start: number;
        readonly end: number;
    }

    /**
     * A highlight with the position for where it should be displayed in the
     * viewport.
     */
    export interface IHighlightViewportPosition extends IHighlightNode, IViewportPosition {

    }

    /**
     * Take all the nodes we need to highlight, split them by character, then
     * segment them into rows that are overflowing.
     */
    export function toHighlightViewportPositions(nodeTextRegions: ReadonlyArray<NodeTextRegion>): ReadonlyArray<IHighlightViewportPosition> {

        function splitNodeTextRegion(nodeTextRegion: NodeTextRegion): ReadonlyArray<NodeTextRegion> {

            function createNodeTextRegion(start: number): NodeTextRegion {

                return {
                    ...nodeTextRegion,
                    start,
                    end: start + 1
                };

            }

            return Numbers.range(nodeTextRegion.start, nodeTextRegion.end - 1)
                          .map(createNodeTextRegion)

        }

        function createSplitNodeTextRegions(): ReadonlyArray<NodeTextRegion> {
            return arrayStream(nodeTextRegions)
                       .map(splitNodeTextRegion)
                       .flatMap(current => current)
                       .collect();
        }

        function createHighlightViewportPositions(nodeTextRegions: ReadonlyArray<NodeTextRegion>) {

            function toHighlightViewportPositions(nodeTextRegion: NodeTextRegion): IHighlightViewportPosition {

                const viewportPosition = Highlights.createViewportPosition(nodeTextRegion);
                return {
                    ...viewportPosition,
                    ...nodeTextRegion
                };

            }

            return nodeTextRegions.map(toHighlightViewportPositions);

        }

        function mergeHighlightViewportPositions(highlightViewportPositions: ReadonlyArray<IHighlightViewportPosition>): ReadonlyArray<IHighlightViewportPosition> {

            function toKey(highlightViewportPosition: IHighlightViewportPosition): string {
                return highlightViewportPosition.nodeID + ':' + highlightViewportPosition.top + ':' + highlightViewportPosition.height
            }

            function merge(groupPositions: ReadonlyArray<IHighlightViewportPosition>): IHighlightViewportPosition {

                const sorted = arrayStream(groupPositions)
                    .sort((a, b) => a.start - b.start)
                    .collect();

                const first = Arrays.first(sorted)!;
                const last = Arrays.last(sorted)!;

                const left = first.left;
                const right = last.left + last.width;
                const width = right - left;

                return {
                    top: first.top,
                    left: first.left,
                    height: first.height,
                    width,
                    node: first.node,
                    nodeID: first.nodeID,
                    start: first.start,
                    end: last.end
                };

            }

            return arrayStream(highlightViewportPositions)
                      .group(toKey)
                      .map(merge)
                      .collect();

        }

        // take each NodeTextRegion and split them out into one character each..
        const splitNodeTextRegions = createSplitNodeTextRegions();

        // compute each position in the viewport
        const highlightViewportPositions = createHighlightViewportPositions(splitNodeTextRegions);
        // then re-join based on top/height of each one.
        return mergeHighlightViewportPositions(highlightViewportPositions);

    }

    export function intersects(parent: ILTRect, child: ILTRect): boolean {
        return Rects.intersect(Rects.createFromBasicRect(parent), Rects.createFromBasicRect(child));
    }

    export function intersectsWithWindow(position: IHighlightViewportPosition): boolean {

        const doc = position.node.ownerDocument;

        if (! doc) {
            return false;
        }

        const win = doc.defaultView;

        if (! win) {
            return false;
        }

        const parent: ILTRect = {
            top: 0,
            left: 0,
            width: win.innerWidth,
            height: win.innerHeight
        };

        return intersects(parent, position);

    }

    function rangeToText(range: Range): string {
        const contents = range.cloneContents();
        const div = document.createElement('div');
        div.append(contents);
        return div.innerText;
    }

    export function createViewportPosition(highlight: IHighlightNode): IViewportPosition {

        const {node} = highlight;
        const doc = node.ownerDocument;

        if (! doc) {
            throw new Error("Node has no owner document");
        }

        const range = doc.createRange();

        function computeEnd() {

            if (! node.nodeValue ) {
                return 0;
            }

            // this is a workaround for a small bug with the
            // polar-dom-text-search where sometimes the length is off by one.
            // we need to find the root cause but at last this works around it
            // for now and shouldn't impact anything once the bug is fixed.
            return Math.min(node.nodeValue?.length, highlight.end + 1);

        }

        try {
            range.setStart(node, highlight.start);
            range.setEnd(node, computeEnd());
        } catch (e) {
            console.warn(`Unable to mount annotation on node: ${e.message}`, node);
            throw e;
        }

        const rect = range.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

    }

    /**
     * Convert a fixed position to an absolute position.
     */
    export function fixedToAbsolute(position: IHighlightViewportPosition): ILTRect {

        Preconditions.assertPresent(position, 'position');

        const doc = position.node.ownerDocument!;
        const win = doc.defaultView!;

        const scrollLeft = win?.pageXOffset || doc.documentElement.scrollLeft;
        const scrollTop = win?.pageYOffset || doc.documentElement.scrollTop;

        return {
            top: position.top + scrollTop,
            left: position.left + scrollLeft,
            width: position.width,
            height: position.height
        };

    }

}
