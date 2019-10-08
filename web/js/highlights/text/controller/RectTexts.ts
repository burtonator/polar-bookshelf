import {Point} from '../../../Point';
import {Rect} from '../../../Rect';
import {Objects} from '../../../util/Objects';
import {Rects} from '../../../Rects';
import {RectText} from './RectText';
import {TextNodes} from '../selection/TextNodes';

export class RectTexts {

    /**
     *
     * @param textNodes
     */
    public static toRectTexts(textNodes: Node[]) {
        return textNodes.map(RectTexts.toRectText)
                        .filter(current => current.boundingPageRect.width > 0 && current.boundingPageRect.height > 0);
    }

    /**
     * Take a Node of type TEXT and build a RectText including the the text,
     * the rects, etc.
     *
     * @param textNode {Node}
     * @return {RectText}
     */
    public static toRectText(textNode: Node) {

        const range = TextNodes.getRange(textNode);

        // FIXME: this is wrong and we are using teh wrong scroll position.

        const win = textNode.ownerDocument!.defaultView!;

        const scrollPoint = new Point({
            x: win.scrollX,
            y: win.scrollY
        });

        const boundingClientRect = range.getBoundingClientRect();

        // FIXMEL this is the bug because it copies toJSON
        let boundingPageRect = Rects.validate(boundingClientRect);

        boundingPageRect = Rects.relativeTo(scrollPoint, boundingPageRect);

        return new RectText({
            clientRects: range.getClientRects(),
            boundingClientRect,
            boundingPageRect,
            text: textNode.textContent
        });

    }

}
