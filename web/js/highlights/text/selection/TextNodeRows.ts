import {Preconditions} from "polar-shared/src/Preconditions";
import {TextNodes} from './TextNodes';
import {Rects} from '../../../Rects';
import {Text} from '../../../util/Text';
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";
import createSiblings = Tuples.createSiblings;

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
export class TextRegion {

    private textNodes: any[] = [];

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
    public textNode: Node;

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

    public nodes: ReadonlyArray<Node>;

    /**
     *
     */
    constructor(nodes: ReadonlyArray<Node>) {
        Preconditions.assertNotNull(nodes, "nodes");
        this.nodes = nodes;
    }

    get length() {
        return this.nodes.length;
    }

    /**
     * Get the input as a list of nodes to process.  If the node we give it is
     * ALREADY a single text node just return that wrapped in an array.
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

    public static fromTextNode(textNode: Node) {

        if(textNode.nodeType !== Node.TEXT_NODE) {
            throw new Error("Not a text node");
        }

        const nodeArray = TextNodeRows.splitTextNodePerCharacter(textNode);

        const textRegions = TextNodeRows.computeTextRegions(nodeArray);

        const textBlocks = TextNodeRows.computeTextBlocks(textRegions);

        const mergedTextBlocks = TextNodeRows.mergeTextBlocks(textBlocks);

        return mergedTextBlocks.map(current => current.textNode);

    }

    public static fromTextNodes(textNodes: ReadonlyArray<Node>): ReadonlyArray<Node> {
        return arrayStream(textNodes)
            .map(TextNodeRows.fromTextNode)
            .flatMap(current => current)
            .collect();
    }

    /**
     *
     */
    static splitElement(element: HTMLElement) {

        let result = 0;

        Array.from(element.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {
                const nodeArray = TextNodeRows.splitTextNodePerCharacter(current);
                result += nodeArray.length;
            }

            if(current.nodeType === Node.ELEMENT_NODE) {
                // this is a regular element recurse into it splitting that too.
                result += TextNodeRows.splitElement(<HTMLElement> current);
            }

        });

        return result;

    }

    static computeTextRegions(nodeArray: NodeArray): ReadonlyArray<TextRegion> {
        return this.computeTextRegions0(nodeArray, []);
    }

    /**
     * Text regions are groups of contiguous text nodes that are back to back
     * without an element in between.
     *
     */
    static computeTextRegions0(nodeArray: NodeArray, textRegions: TextRegion[]): ReadonlyArray<TextRegion> {

        // TODO: pass textRegions as an array as it's being copied each time.

        Preconditions.assertPresent(nodeArray, "nodeArray");

        if(nodeArray.constructor !== NodeArray) {
            throw new Error("Not a node array: " + nodeArray.constructor);
        }

        // all text regions that we're working on
        if( ! textRegions) {
            textRegions = [];
        }

        let textRegion = new TextRegion();

        for (const position of createSiblings(nodeArray.nodes)) {

            const currentNode = position.curr;

            if (currentNode.nodeType === Node.TEXT_NODE) {
                textRegion.push(currentNode);
            } else if( currentNode.nodeType === Node.ELEMENT_NODE) {

                textRegions.push(textRegion);
                textRegion = new TextRegion();

                TextNodeRows.computeTextRegions0(NodeArray.createFromElement(currentNode),
                                                 textRegions);

            }

            // *** handle the last node

            if(position.next === undefined && textRegion.length > 0) {
                // don't drop the last block
                textRegions.push(textRegion);
            }

        }

        return textRegions;

    }

    /**
     * From the regions we can compute the blocks if the Rect rows aren't the
     * same.
     *
     * The rect rows are computed by looking at the top and bottom of the row
     * to see if they are different.
     *
     */
    static computeTextBlocks(textRegions: ReadonlyArray<TextRegion>): ReadonlyArray<TextBlock> {

        const textBlocks: TextBlock[] = [];

        textRegions.forEach(textRegion => {

            let textBlock = new TextBlock();

            // keep track of the previous (visible) rect that we've seen so that
            // we can compare our position.

            let prevRect: any = null;

            createSiblings(textRegion.getTextNodes()).forEach(position => {

                // *** handle middle nodes

                const currRect = TextNodes.getRange(position.curr).getBoundingClientRect();

                if (Rects.isVisible(currRect)) {

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

                if(position.next === undefined && textBlock.length > 0) {
                    // don't drop the last block
                    textBlocks.push(textBlock);
                }

            });

        });

        return textBlocks;

    }

    static mergeTextBlocks(textBlocks: ReadonlyArray<TextBlock>): ReadonlyArray<MergedTextBlock> {

        const result: MergedTextBlock[] = [];

        textBlocks.forEach(textBlock => {

            const textNodes = textBlock.getTextNodes().slice();

            const text = textBlock.toString();

            // the first node should get the text value.

            const textNode = textNodes.pop();
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
     */
    static computeRowKey(rect: DOMRect | ClientRect) {
        return `${rect.top}:${rect.bottom}`;
    }

    /**
     * Split the given text node so that every character has its own text
     * node so that we can see the actual position on the screen.
     *
     */
    static splitTextNodePerCharacter(textNode: Node) {

        const result = [

        ];

        // TODO: migrate to map.
        while (textNode.textContent && textNode.textContent.length > 1) {
            result.push(textNode);
            // TODO: migrate this to use Text
            textNode = (<any> textNode).splitText(1);
        }

        result.push(textNode);

        return new NodeArray(result);

    }

}

