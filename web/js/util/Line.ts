import {isPresent, notNull, Preconditions} from 'polar-shared/src/Preconditions';


/**
 * Simple line with just a start and end.
 */
export class Line {

    public readonly start: number;
    public readonly end: number;
    public readonly axis?: string;

    /**
     *
     * @param start
     * @param end
     * @param [axis] Optional axis parameter ('x' or 'y')
     */
    constructor(start: number, end: number, axis?: string) {
        this.start = Preconditions.assertNumber(start, "start");
        this.end = Preconditions.assertNumber(end, "end");
        this.axis = axis; // TODO validate
        // this.length = length;
    }

    /**
     * The width of the line. Not to be confused with the width of a rect.
     *
     * @Deprecated The dimension of a line is length. Not width. Use length()
     * instead.
     * @return {number}
     */
    get width() {
        return this.end - this.start;
    }

    get length() {
        return this.end - this.start;
    }

    /**
     * Return true if the given point is between the start and end position
     * of the line (inclusive)
     *
     * @param pt {number}
     * @return {boolean}
     */
    containsPoint(pt: number) {
        return this.within(pt);
    }

    /**
     * Return true if the point is within the start and end points of this line.
     *
     * @param pt {number}
     */
    within(pt: number) {
        return this.start <= pt && pt <= this.end;
    }

    /**
     * Return true if the given line overlaps the current line.  IE either the start
     * or end point on the given line is between the start and end points of the
     * current line.
     *
     */
    overlaps(line: Line): boolean {
        Preconditions.assertNotNull(line, "line");

        //console.log("DEBUG: %s vs %s", this.toString("interval"), line.toString("interval"));

        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    /**
     *
     * @param [fmt] optional format parameter. May be 'interval' for interval notation.
     * @return {string}
     */
    toString(fmt: string) {

        if(fmt === "interval") {
            return `[${this.start},${this.end}]`;
        }

        return `{start: ${this.start}, end: ${this.end}}`;

    }

    /**
     * Build a new line based on the given scalar.  Essentially this models
     * the line as a vector with zero as the origin and length as the magnitude
     * and we just apply the scalar to build the new vector with a different
     * start origin.
     *
     */
    multiply(scalar: number): Line {
        return new Line(this.start * scalar, this.end * scalar, this.axis);
    }

    /**
     * Call Math.floor on the points in this line.
     */
    floor(): Line {
        return new Line(Math.floor(this.start), Math.floor(this.end), this.axis);
    }

    toJSON() {

        return {
            axis: this.axis,
            start: this.start,
            end: this.end,
            length: this.length
        };

    }

    static interval(start: number, pt: number, end: number): boolean {
        return start <= pt && pt <= end;
    }

    static builder() {
        return new LineBuilder();
    }

}

class LineBuilder {

    private start?: number;

    private end?: number;

    private length?: number;

    private axis?: string;

    setStart(value: number) {
        this.start = value;
        return this;
    }

    setEnd(value: number) {
        this.end = value;
        return this;
    }

    setLength(value: number) {
        this.length = value;
        return this;
    }

    setAxis(value: string) {
        this.axis = value;
        return this;
    }

    build() {

        let start = notNull(this.start);

        if(! isPresent(this.end) && isPresent(this.length)) {
            this.end = start + this.length!;
        }

        let end = notNull(this.end);

        return new Line(start, end);

    }

}
