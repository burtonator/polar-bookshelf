import {Rect} from "../Rect";
import {AreaHighlightRect} from "./AreaHighlightRect";
import {IRect} from 'polar-shared/src/util/rects/IRect';

export class AreaHighlightRects {

    public static createFromRect(rect: Rect | IRect) {

        return new AreaHighlightRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

}
