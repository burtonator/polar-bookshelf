import {Rect} from "../../../../Rect";
import {LineAdjustment} from './LineAdjustment';

/**
 * Represents the results from the {RectAdjacencyCalculator}
 */
export class Adjacency {

    public primaryRect: Rect;

    public secondaryRect: Rect;

    public adjustments: Adjustments;

    public adjustment: LineAdjustment;

    public adjustedRect: Rect;

    constructor() {
        this.primaryRect = null!;
        this.secondaryRect = null!;
        this.adjustments = {
            horizontal: null!,
            vertical: null!
        };
        this.adjustment = null!;
        this.adjustedRect = null!;
    }

}

export interface Adjustments {
    horizontal: LineAdjustment;
    vertical: LineAdjustment;
}
