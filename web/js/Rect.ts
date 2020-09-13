import {Dimensions} from './util/Dimensions';
import {Line} from './util/Line';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";

/**
 * Basic DOM style rect without a hard requirement to use a DOMRect.
 */
export class Rect implements IRect, ILTRect {

    // TODO: some rects have x,y as well as left,top ... should we add them here
    // to be complete and closer to a DOMRect?

    public left: number;
    public top: number;
    public right: number;
    public bottom: number;
    public width: number;
    public height: number;

    constructor(obj: any = {}) {

        Preconditions.assertNotNull(obj, "obj");

        this.left = obj.left;
        this.top = obj.top;
        this.right = obj.right;
        this.bottom = obj.bottom;
        this.width = obj.width;
        this.height = obj.height;

    }

    /**
     *
     * @param axis {String} The axis to use (x or y)
     * @return {Line}
     */
    public toLine(axis: Axis) {

        if (axis === "x") {
            return new Line(this.left, this.right, axis);
        } else if (axis === "y") {
            return new Line(this.top, this.bottom, axis);
        } else {
            throw new Error("Wrong axis: " + axis);
        }

    }

    public get dimensions(): Dimensions {
        return new Dimensions({
            width: this.width,
            height: this.height
        });
    }

    public get area(): number {
        return this.width * this.height;
    }

    /**
     * Adjust an axis based on the given line.
     *
     * @param line {Line} The line representing the axis.
     * @return {Rect} Return a NEW rect with updated dimensions.
     */
    public adjustAxis(line: Line) {

        Preconditions.assertNotNull(line, "line");
        Preconditions.assertNotNull(line.axis, "line.axis");

        const result = new Rect(this);

        if (line.axis === "x") {

            result.left = line.start;
            result.right = line.end;
            result.width = line.end - line.start;

        } else if (line.axis === "y") {

            result.top = line.start;
            result.bottom = line.end;
            result.height = line.end - line.start;

        } else {
            throw new Error("Invalid axis: " + line.axis);
        }

        return result;

    }

}

export type Axis = 'x' | 'y';

