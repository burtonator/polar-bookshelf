import {Preconditions} from 'polar-shared/src/Preconditions';
import {Dimensions} from '../util/Dimensions';
import {Interval} from '../math/Interval';
import {Rects} from '../Rects';
import {IAnnotationRect} from "polar-shared/src/metadata/IAnnotationRect";

const ENTIRE_PAGE = Rects.createFromBasicRect({ left: 0, top: 0, width: 100, height: 100});

/**
 * A AnnotationRect is a basic Rect for representing an annotation on a page.
 *
 * This is a box layout for an annotation.  We use the typical DOM positioning
 * style of top, left, width and height only instead of percentages we represent
 * this as percentage of the entire 'page'.
 *
 * This would represent the range within a page that a box covers.  This is
 * essentially a range has a start and end which are percentages of the page that
 * a rect covers but in two dimensions (not just one).
 *
 * A default rect (for the entire page) would have a value of:
 *
 * { top: 0, left: 0, width: 100, height: 100 }
 *
 * A range for a page that is half way completed is [0,50]
 *
 * { top: 0, left: 0, width: 100, height: 50 }
 *
 * We also provide additional functionality where we can start the rect
 * other than at the top of the page. For example, if you wanted to mark the
 * bottom 50% of the page as read, you could create the rect as:
 *
 * { top: 50, left: 0, width: 100, height: 50 }
 *
 * The user can create rect at any point and then we create a small rect
 * anchored to that spot, and give it a bit of height so that the user can
 * visually see it.
 *
 * Note that the percentage are of the available width and height.  The normal
 * ratio we use is 8.5x11 but width and height as percentages would be 100x100.
 *
 * This would NOT be a square but a rectangle and the percentages confuse that.
 *
 */
export class AnnotationRect implements IAnnotationRect {

    /**
     * @type {number}
     */
    public left: number;

    /**
     * @type {number}
     */
    public top: number;

    /**
     * @type {number}
     */
    public width: number;

    /**
     * @type {number}
     */
    public height: number;

    constructor(obj: any) {

        this.left = obj.left;
        this.top = obj.top;
        this.width = obj.width;
        this.height = obj.height;

        Object.assign(this, obj);

        this._validate();

    }

    /**
     * Make sure we are in a valid state and that the intervals are within
     * proper values.
     *
     */
    private _validate() {

        const interval = new Interval(0, 100);

        const assertInterval = (value: number) => interval.containsPoint(value);

        Preconditions.assert(this.top, assertInterval, "top");
        Preconditions.assert(this.left, assertInterval, "left");
        Preconditions.assert(this.width, assertInterval, "width");
        Preconditions.assert(this.height, assertInterval, "height");

    }

    /**
     * Compute a percentage of the page that this rect holds.
     */
    public toPercentage(): number {
        return 100 * (Rects.createFromBasicRect(this).area / ENTIRE_PAGE.area);
    }

    /**
     * Convert this to a fractional rect where all the values are in the
     * interval [0.0,1.0]
     *
     * @return {Rect}
     */
    public toFractionalRect() {

        const result = {
            left: this.left / 100,
            top: this.top / 100,
            width: this.width / 100,
            height: this.height / 100,
        };

        return Rects.createFromBasicRect(result);

    }

    /**
     * Convert to a new AnnotationRect of the specific dimensions.
     *
     * @return {Rect}
     */
    public toDimensions(dimensions: Dimensions) {

        Preconditions.assertPresent(dimensions, "dimensions");

        const fractionalRect = this.toFractionalRect();

        // TODO: this will give us fractional pixels which I think is wrong.

        return Rects.createFromBasicRect({
            left: fractionalRect.left * dimensions.width,
            width: fractionalRect.width * dimensions.width,
            top: fractionalRect.top * dimensions.height,
            height: fractionalRect.height * dimensions.height,
        });

    }

    public toDimensionsFloor(dimensions: Dimensions) {

        Preconditions.assertPresent(dimensions, "dimensions");

        const fractionalRect = this.toFractionalRect();

        // TODO: this will give us fractional pixels which I think is wrong.

        return Rects.createFromBasicRect({
            left: Math.floor(fractionalRect.left * dimensions.width),
            width: Math.floor(fractionalRect.width * dimensions.width),
            top: Math.floor(fractionalRect.top * dimensions.height),
            height: Math.floor(fractionalRect.height * dimensions.height),
        });

    }


}

