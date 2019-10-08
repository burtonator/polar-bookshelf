import {Rect} from "../../../../Rect";
import {Rects} from "../../../../Rects";
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Objects} from "../../../../util/Objects";

export class LineAdjustment {

    public overlapped: boolean;

    public start: number;

    public previous: number;

    /**
     * Whether we snapped before or after the intersection.
     */
    public snapped: string;

    /**
     * The proposed change for this line.
     */
    public delta: number;

    /**
     * The cartesian axis this line represents.  Either "x" or "y".
     *
     * This is used to adjust the rect when complete.
     */
    public axis: string;

    constructor(obj: any) {

        this.overlapped = obj.overlapped;
        this.start = obj.start;
        this.previous = obj.previous;
        this.snapped = obj.snapped;
        this.delta = obj.delta;
        this.axis = obj.axis;

    }

    /**
     * Apply the adjustment to the given rect and return the new rect.
     *
     */
    public adjustRect(primaryRect: Rect) {

        const dir: any = {};
        dir[this.axis] = this.start;

        const absolute = true;

        return Rects.move(primaryRect, dir, absolute);

    }

    public static create(opts: any) {

        Preconditions.assertNotNull(opts.start, "start");
        Preconditions.assertNotNull(opts.previous, "previous");
        Preconditions.assertNotNull(opts.snapped, "snapped");
        Preconditions.assertNotNull(opts.axis, "axis");

        opts = Objects.duplicate(opts);
        opts.overlapped = true;
        opts.delta = Math.abs(opts.previous - opts.start);

        return new LineAdjustment(opts);

    }

}
