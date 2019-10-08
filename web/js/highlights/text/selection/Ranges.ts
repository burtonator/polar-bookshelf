import {Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {NodeTypes} from './NodeTypes';

const log = Logger.create();

export class Ranges {

    /**
     * Create duplicate of the given ranges so that we can know that we have
     * our own unique copies that can't be reset.
     *
     */
    public static cloneRanges(ranges: Range[]) {
        return ranges.map(range => range.cloneRange());
    }

    /**
     * Split a text node and get the new / starting node.
     *
     */
    public static splitTextNode(container: Node,
                                offset: number,
                                useStartBoundary: boolean) {

        if (container.nodeType !== Node.TEXT_NODE &&
            container.nodeType !== Node.COMMENT_NODE &&
            container.nodeType !== Node.CDATA_SECTION_NODE) {

            if (offset > 0) {

                // If the startNode is a Node of type Text, Comment, or
                // CDATASection, then startOffset is the number of characters
                // from the start of startNode. For other Node types,
                // startOffset is the number of child nodes between the start of
                // the startNode.

                return container.childNodes[offset];

            }

            return container;

        }

        // TODO: this is not necessarily a text node but we're casting it...
        const newNode = (<Text> container).splitText(offset);

        if (useStartBoundary) {
            return newNode;
        } else {
            return newNode.previousSibling!;
        }

    }

    /**
     * Return HTML content of the range selected.
     *
     */
    public static toHTML(range: Range) {

        let result = "";

        const docFragment = range.cloneContents();

        docFragment.childNodes.forEach(childNode => {

            if (childNode.nodeType === Node.TEXT_NODE) {
                result += childNode.textContent;
            } else {
                result += (<HTMLElement> childNode).outerHTML;
            }

        });

        return result;

    }

    public static toText(range: Range) {

        let result = "";

        const docFragment = range.cloneContents();

        docFragment.childNodes.forEach(childNode => {

            if (childNode.nodeType === Node.TEXT_NODE) {
                result += childNode.textContent;
            } else {
                result += (<HTMLElement> childNode).innerText;
            }

        });

        return result;

    }


    /**
     * Get the text nodes for range. Optionally splitting the text if necessary
     *
     * @param range {Range}
     * @return {Array<Node>}
     */
    public static getTextNodes(range: Range) {

        Preconditions.assertNotNull(range, "range");

        // We start walking the tree until we find the start node, then we
        // enable set inSelection = true... then when we exit the selection by
        // hitting the end node we just return out of the while loop and we're
        // done

        const startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        const endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);

        Preconditions.assertNotNull(startNode, "startNode");
        Preconditions.assertNotNull(endNode, "endNode");

        const doc = range.startContainer.ownerDocument!;

        // use TreeWalker to walk the commonAncestorContainer and we see which
        // ranges contain which text nodes.
        const treeWalker = doc.createTreeWalker(range.commonAncestorContainer);

        const result = [];

        let node;

        let inSelection = false;

        // ** traverse until we find the start
        while (node = treeWalker.nextNode()) {
            if (startNode === node) {
                inSelection = true;
                break;
            }

        }

        // ** now keep consuming until we hit the last node.

        while (node) {

            if (node.nodeType === Node.TEXT_NODE) {
                result.push(node);
            }

            if (endNode === node) {
                break;
            }

            node = treeWalker.nextNode();

        }

        return result;

    }

    /**
     * Similar to getTextNodes but we return true if the nodes have text in them.
     *
     *
     * @param range
     */
    public static hasText(range: Range) {

        // TODO massive amount of duplication with getTextNodes and might be
        // valuable to rework this to a visitor pattern which accepts a function
        // which returns true if we should keep moving forward.

        Preconditions.assertNotNull(range, "range");

        // We start walking the tree until we find the start node, then we
        // enable set inSelection = true... then when we exit the selection by
        // hitting the end node we just return out of the while loop and we're
        // done

        const startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        const endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);

        Preconditions.assertNotNull(startNode, "startNode");
        Preconditions.assertNotNull(endNode, "endNode");

        const doc = range.startContainer.ownerDocument!;

        // use TreeWalker to walk the commonAncestorContainer and we see which
        // ranges contain which text nodes.
        const treeWalker = doc.createTreeWalker(range.commonAncestorContainer);

        const result = [];

        let node;

        let inSelection = false;

        // ** traverse until we find the start
        while (node = treeWalker.nextNode()) {
            if (startNode === node) {
                inSelection = true;
                break;
            }

        }

        // ** now keep consuming until we hit the last node.

        while (node) {

            if (node.nodeType === Node.TEXT_NODE) {

                if (node.textContent && node.textContent.trim() !== '') {
                    return true;
                }

            }

            if (endNode === node) {
                break;
            }

            node = treeWalker.nextNode();

        }

        return false;

    }

    public static describeNode(node: Node) {
        return (<HTMLElement> node.cloneNode(false)).outerHTML;
    }

}
