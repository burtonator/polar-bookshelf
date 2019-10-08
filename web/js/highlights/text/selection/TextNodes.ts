import {Preconditions} from 'polar-shared/src/Preconditions';

export class TextNodes {

    /**
     * Create a Range around this textNode so that we can compute metadata like
     * the clientRects which normally can't be determined from a TextNode.
     *
     * @param textNode
     * @param offset
     * @param length
     * @return {Range}
     */
    public static getRange(textNode: Node, offset: number = 0, length?: number) {

        Preconditions.assertPresent(textNode, "textNode");

        if (! length) {
            length = textNode.textContent!.length;
        }

        const range = document.createRange();

        range.setStart(textNode, offset);
        range.setEnd(textNode, length);

        return range;

    }

    // /**
    //  *
    //  * @param textNode {Node}
    //  * @param offset {number}
    //  * @param length {number}
    //  */
    // static getClientRects(textNode, offset, length) {
    //     return range.getClientRects();
    // }

}
