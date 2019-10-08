import {Rect} from "../../../Rect";
import {RectElement} from "./RectElement";

/**
 * An intermediate row with a rect covering the whole row and the rectElements
 * it contains.
 */
export class IntermediateRow {

    public rect: Rect;
    public rectElements: RectElement[];

    constructor(rect: Rect, rectElements: RectElement[]) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

}
