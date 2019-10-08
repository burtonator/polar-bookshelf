import {Preconditions} from 'polar-shared/src/Preconditions';
import {LineEdges} from "./LineEdges";

/**
 * Stores how we are resizing a rect.  If any of the values are defined that
 * means this side is being resized. At most TWO can be resized at once.
 */
export class RectEdges {

    public readonly left: boolean;
    public readonly top: boolean;
    public readonly right: boolean;
    public readonly bottom: boolean;

    constructor(obj: any) {

        this.left = obj.left;
        this.top = obj.top;
        this.right = obj.right;
        this.bottom = obj.bottom;

        //  make sure we have all the values.

        Preconditions.assertTypeOf(this.left, "boolean", "left");
        Preconditions.assertTypeOf(this.top, "boolean", "top");
        Preconditions.assertTypeOf(this.right, "boolean", "right");
        Preconditions.assertTypeOf(this.bottom, "boolean", "bottom");

    }

    toLineEdges(axis: 'x' | 'y') {
        if(axis === "x") {
            return new LineEdges({start: this.left, end: this.right});
        } else if (axis === "y") {
            return new LineEdges({start: this.top, end: this.bottom});
        } else {
            throw new Error("Unknown axis: " + axis);
        }
    }

}
