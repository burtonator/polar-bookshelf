import {Rect} from '../../Rect';
import {Preconditions} from 'polar-shared/src/Preconditions';

export class BoxMoveEvent {

    /**
     * The type of the event.  Either 'resize' or 'drag'
     */
    public type: string;

    /**
     * The restrictionRect Rect of the box we moved.  This is the parent
     * Rect.
     *
     */
    public restrictionRect: Rect;

    /**
     * The Rect of the box we moved.  This is the final position of the box
     * once we're done moving it.
     *
     */
    public boxRect: Rect;

    /**
     * The ID of the box we moved.
     *
     */
    public id: string;

    /**
     * The element being moved.
     *
     */
    public target: HTMLElement;

    /**
     * The state of the box movement. States are:
     *
     * pending: The box is still being drawn but the user hasn't finished
     * moving it:
     *
     * completed: The box move operation is completed and is in its final position.
     *
     */
    public state: string = "pending";

    constructor(opts: any) {

        this.type = opts.type;
        this.restrictionRect = opts.restrictionRect;
        this.boxRect = opts.boxRect;
        this.id = opts.id;
        this.target = opts.target;
        this.state = "pending";

        Object.assign(this, opts);

        Preconditions.assertInstanceOf(this.boxRect, Rect, "boxRect");

    }

}

