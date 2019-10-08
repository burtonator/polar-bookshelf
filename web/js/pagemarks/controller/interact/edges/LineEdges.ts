import {Preconditions} from 'polar-shared/src/Preconditions';

/**
 * Like {RectEdges} but only for lines and only for start and end.
 */
export class LineEdges {

    public readonly start: boolean;
    public readonly end: boolean;

    constructor(obj: any) {

        this.start = obj.start;
        this.end = obj.end;

        //  make sure we have all the values.

        Preconditions.assertTypeOf(this.start, "boolean", "start");
        Preconditions.assertTypeOf(this.end, "boolean", "end");

    }

}
