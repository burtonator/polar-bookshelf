/**
 * A region of text within the document where the nodes are split and are back to
 * back without an element in between but MAY be between different rows.
 *
 * We use this is because we're getting two regions with 'expanded' boxes.  An
 * expanded box is like this
 *
 * +----------------+
 * |xxxxxxxxxxxxxxxx|
 * |xx              |
 * +----------------+
 *
 * - Instead we should call splitText and then build two boxes like:
 *
 * +----------------+
 * |xxxxxxxxxxxxxxxx|
 * +--+-------------+
 * |xx|
 * +--+
 *
 * which would look far more appropriate
 *
 */
import {Preconditions} from "polar-shared/src/Preconditions";
import {TextNodes} from './TextNodes';
import {Rects} from '../../../Rects';
import {createSiblings} from 'polar-shared/src/util/Functions';
import {Text} from '../../../util/Text';

export class TextRegion {

    private textNodes: any[] = [];

    constructor() {
    }

    push(textNode: any) {

        if(textNode.textContent.length > 1) {
            throw new Error("Nodes must be split");
        }

        this.textNodes.push(textNode);
    }

    /**
     * Return the nodes for this region.
     */
    getTextNodes() {
        return this.textNodes;
    }

    get length() {
        return this.textNodes.length;
    }

    /**
     * Return an array of text nodes into a string.
     */
    toString() {

        let result = "";

        this.textNodes.forEach(textNode => {
            result += textNode.textContent;
        });

        return result;

    }

    format() {
        return `(${this.textNodes.length}): \n` + Text.indent(this.toString(), "  ");
    }

    toJSON() {
        // FIXME: this isn't toJSON as it's returning an object... not a string.
        return { nrNodes: this.textNodes.length, text: this.toString() };
    }

}

/**
 * A TextBlock are structurally the same as TextRegion but semantically a
 * TextBlock is on different visual rows.
 */
class TextBlock extends TextRegion {

}

class MergedTextBlock {

    /**
     * The merged Node of type TEXT_NODE
     */
    public textNode: any;

    /**
     * The rect of this node.
     */
    public rect: any;

    /**
     * The text value of the node.
     */
    public text: string;

    constructor(obj: any) {

        this.textNode = obj.textNode;
        this.rect = obj.rect;
        this.text = obj.text;

    }

    toString() {
        return this.text;
    }

    /**
     * Convert to an object that can be serialized.
     */
    toExternal() {
        return {text: this.text, rect: this.rect};
    }

}

/**
 * Holds an array of nodes that we can work with.
 */
export class NodeArray {

    private nodes: any;

    /**
     *
     * @param nodes {Array<Node>}
     */
    constructor(nodes: any) {
        Preconditions.assertNotNull(nodes, "nodes");
        this.nodes = nodes;
    }

    get length() {
        return this.nodes.length;
    }

    /**
     * Get the input as a list of nodes to process.  If the node we give it is
     * ALREADY a single text node just return that wrapped in an array.
     * @param element
     */
    static createFromElement(element: any) {

        if(element.nodeType === Node.ELEMENT_NODE) {
            return new NodeArray(element.childNodes);
        } else if(element.nodeType === Node.TEXT_NODE) {
            throw new Error("Text node not supported");
        } else {
            throw new Error("Unable to handle node type: " + element.nodeType);
        }

    }

}

/**
 * Build rows of contiguous text nodes plus break them apart based on how they
 * display visually.
 *
 * This algorithm has three steps:
 *
 * - split all the text nodes into single char text nodes
 * - find all 'regions' of contiguous text nodes
 *
 * - then find all 'blocks' in these regions by splitting the regions where
 *   the text starts a new row vertically.
 *
 */
export class TextNodeRows {

    /**
     *
     * @param textNode {Node}
     * @return {Array<Node>}
     */
    static fromTextNode(textNode: any) {

        if(textNode.nodeType !== Node.TEXT_NODE) {
            throw new Error("Not a text node");
        }

        let nodeArray = TextNodeRows.splitTextNodePerCharacter(textNode);

        let textRegions = TextNodeRows.computeTextRegions(nodeArray, null);

        let textBlocks = TextNodeRows.computeTextBlocks(textRegions);

        let mergedTextBlocks = TextNodeRows.mergeTextBlocks(textBlocks);

        let result = mergedTextBlocks.map(current => current.textNode);

        return result;

    }

    /**
     *
     * @param textNodes {Array<Node>}
     * @return {Array<Node>}
     */
    static fromTextNodes(textNodes: any[]) {

        /**
         * @type {Array<Node>}
         */
        const result: any = [];

        textNodes.forEach(textNode => {
            result.push(...TextNodeRows.fromTextNode(textNode));
        });

        //console.log("FIXME: 123: going to return N: " + result.length)

        return result;

    }

    /**
     *
     * @param element {Element} The root node to split.
     * @return {number} The number of nodes split.
     */
    static splitElement(element: HTMLElement) {

        let result = 0;

        Array.from(element.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {
                let nodeArray = TextNodeRows.splitTextNodePerCharacter(current);
                result += nodeArray.length;
            }

            if(current.nodeType === Node.ELEMENT_NODE) {
                // this is a regular element recurse into it splitting that too.
                result += TextNodeRows.splitElement(<HTMLElement> current);
            }

        });

        return result;

    }

    /**
     * Text regions are groups of contiguous text nodes that are back to back
     * without an element in between.
     *
     * @param nodeArray {NodeArray}
     * @param [textRegions] {Array<TextRegion>} The starting text regions. Used mostly for recursion.
     * @return {Array<TextRegion>} The computed text regions
     */
    static computeTextRegions(nodeArray: any, textRegions: any) {

        Preconditions.assertNotNull(nodeArray, "nodeArray");

        if(nodeArray.constructor !== NodeArray) {
            throw new Error("Not a node array: " + nodeArray.constructor);
        }

        Preconditions.assertNotNull(nodeArray.nodes, "nodeArray.nodes");

        // all text regions that we're working on
        if(!textRegions) {
            textRegions = [];
        }

        // the current region
        /**
         * @type {TextRegion}
         */
        let textRegion = new TextRegion();

        createSiblings(nodeArray.nodes).forEach(position => {

            let currentNode = position.curr;

            if(currentNode.nodeType === Node.TEXT_NODE) {
                textRegion.push(currentNode);
            }

            if(currentNode.nodeType === Node.ELEMENT_NODE) {

                textRegions.push(textRegion);
                textRegion = new TextRegion();

                TextNodeRows.computeTextRegions(NodeArray.createFromElement(currentNode), textRegions);

            }

            // *** handle the last node

            if(position.next === null && textRegion.length > 0) {
                // don't drop the last block
                textRegions.push(textRegion);
            }

        });

        return textRegions;

    }

    /**
     * From the regions we can compute the blocks if the Rect rows aren't the
     * same.
     *
     * The rect rows are computed by looking at the top and bottom of the row
     * to see if they are different.
     *
     * @param textRegions {Array<TextRegion>}
     * @return {Array<TextBlock>}
     */
    static computeTextBlocks(textRegions: ReadonlyArray<TextRegion>) {

        /**
         * @type {Array<TextBlock>}
         */
        const textBlocks: any[] = [];

        textRegions.forEach(textRegion => {

            /**
             * @type {TextBlock}
             */
            let textBlock = new TextBlock();

            // keep track of the previous (visible) rect that we've seen so that
            // we can compare our position.

            /**
             * @type {DOMRect}
             */
            let prevRect: any = null;

            createSiblings(textRegion.getTextNodes()).forEach(position => {

                // *** handle middle nodes

                let currRect = TextNodes.getRange(position.curr).getBoundingClientRect();

                if(Rects.isVisible(currRect)) {

                    if(prevRect != null) {

                        // we have seen at least one rect before so we can compare them now.

                       if(TextNodeRows.computeRowKey(prevRect) !== TextNodeRows.computeRowKey(currRect)) {
                           // we're in a new block now as we've jumped to a new visual row.
                           textBlocks.push(textBlock);
                           textBlock = new TextBlock();
                       }

                    }

                    // since the current rect is visible we can update the
                    // prevRect to avoid \n \r issues which have zero width.
                    prevRect = currRect;

                }


                textBlock.push(position.curr);

                // *** handle the last node

                if(position.next === null && textBlock.length > 0) {
                    // don't drop the last block
                    textBlocks.push(textBlock);
                }

            });

        });

        return textBlocks;

    }

    /**
     *
     *
     * @param textBlocks {Array<TextBlock>}
     * @return {Array<MergedTextBlock>}
     */
    static mergeTextBlocks(textBlocks: ReadonlyArray<TextBlock>): ReadonlyArray<MergedTextBlock> {

        /**
         *
         * @type {Array<MergedTextBlock>}
         */
        const result: MergedTextBlock[] = [];

        textBlocks.forEach(textBlock => {

            let textNodes = textBlock.getTextNodes().slice();

            let text = textBlock.toString();

            // the first node should get the text value.

            let textNode = textNodes.pop();
            textNode.textContent = text;

            // now remove the remaining nodes from the DOM.
            textNodes.forEach(orphanedNode => {
                orphanedNode.parentNode.removeChild(orphanedNode);
            });

            result.push(new MergedTextBlock({
                textNode,
                text,
                rect: TextNodes.getRange(textNode).getBoundingClientRect()
            }));

        });

        return result;

    }

    /**
     *
     * @param rect {DOMRect}
     * @return {string}
     */
    static computeRowKey(rect: DOMRect | ClientRect) {
        return `${rect.top}:${rect.bottom}`;
    }

    /**
     * Split the given text node so that every character has its own text
     * node so that we can see the actual position on the screen.
     *
     * @return {NodeArray} The number of splits we performed.
     */
    static splitTextNodePerCharacter(textNode: any) {

        let result = [

        ];

        while(textNode.textContent.length > 1) {
            result.push(textNode);
            textNode = textNode.splitText(1);
        }

        result.push(textNode);

        return new NodeArray(result);

    }

}

