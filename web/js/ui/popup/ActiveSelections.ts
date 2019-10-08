import {Point} from '../../Point';
import {MouseDirection} from './Popup';
import {Simulate} from 'react-dom/test-utils';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Selections} from '../../highlights/text/selection/Selections';
import {Ranges} from '../../highlights/text/selection/Ranges';

const log = Logger.create();

/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener,
                                   target: HTMLElement = document.body): void {

        let originPoint: Point | undefined;

        let activeSelection: ActiveSelection | undefined;

        type EventFired = 'none' | 'created' | 'destroyed';

        let eventFired: EventFired = 'none';

        // TODO: this code has the following known issues:
        //
        // - when leaving and reentering the target and releasing the mouse
        //   we don't detect this and don't bring up the selection when the mouse
        //   enters again.  I think this could be mitigated
        //
        // - if we click outside of the main iframe then we don't get the follow
        //   on events.

        const handleDestroyedSelection = () => {

            listener({ ...activeSelection!, type: 'destroyed' });
            activeSelection = undefined;

            eventFired = 'destroyed';

        };

        const onMouseUp = (event: MouseEvent | TouchEvent, element: HTMLElement | undefined) => {

            const handleMouseEvent = () => {

                let hasActiveTextSelection: boolean = false;
                eventFired = 'none';

                try {

                    const view: Window = event.view!;
                    const selection = view.getSelection()!;

                    hasActiveTextSelection = this.hasActiveTextSelection(selection);

                    const point = this.eventToPoint(event);

                    if (! element) {
                        log.warn("No target element: ", event.target);
                        return;
                    }

                    if (activeSelection) {
                        handleDestroyedSelection();
                    }

                    if (hasActiveTextSelection) {

                        const mouseDirection: MouseDirection = point.y - originPoint!.y < 0 ? 'up' : 'down';

                        const range = selection.getRangeAt(0);

                        const boundingClientRect = range.getBoundingClientRect();

                        activeSelection = {
                            element,
                            originPoint: originPoint!,
                            mouseDirection,
                            boundingClientRect,
                            selection,
                            view,
                            type: 'created'
                        };

                        listener(activeSelection);

                        eventFired = 'created';

                    }

                } finally {
                    // console.log(`mouseup: hasActiveTextSelection: ${hasActiveTextSelection}, eventFired: ${eventFired}`);
                }

            };

            this.withTimeout(() => handleMouseEvent());

        };

        type EventType = 'mouse' | 'touch';

        const onMouseDown = (event: MouseEvent | TouchEvent, type: EventType) => {

            if (!activeSelection) {
                originPoint = this.eventToPoint(event);
            }

            const element = this.targetElementForEvent(event);

            switch (type) {

                case "mouse":

                    window.addEventListener('mouseup', event => {
                        // this code properly handles the mouse leaving the window
                        // during mouse up and then leaving wonky event handlers.
                        onMouseUp(event, element);
                    }, {once: true});

                    break;

                case "touch":

                    window.addEventListener('touchend', event => {
                        // this code properly handles the mouse leaving the window
                        // during mouse up and then leaving wonky event handlers.
                        onMouseUp(event, element);
                    }, {once: true});

                    break;

            }

        };

        target.addEventListener('mousedown', (event: MouseEvent) => {
            onMouseDown(event, 'mouse');
        });

        target.addEventListener('touchstart', (event: TouchEvent) => {
            onMouseDown(event, 'touch');
        });

        // TODO: I played with closing the annotation bar on right click but
        // it was difficult to setup. It had the following problems:
        //
        //
        // 1. When the selection was active, and we right click, the selection
        //    does not go away.  Which means that the annotation bar should still
        //    be up.
        //
        // 2. There was inconsistent behavior.  If we right click then the
        //    selection goes away if we click outside but stays if we click inside
        //    the selection.
        //
        //  3. This isn't a MASSIVE problem so probably shouldn't spend much time
        //    on it.

        // target.addEventListener('contextmenu', (event: MouseEvent) => {
        //
        //     const handleMouseEvent = () => {
        //
        //         if (activeSelection) {
        //             handleDestroyedSelection();
        //         }
        //
        //     };
        //
        //     this.withTimeout(() => handleMouseEvent());
        //
        // });

    }

    // needs to be called via setTimeout becuase if we click 'on' the
    // selection there's a bug where the selection is still present and
    // isn't removed.  Allowing the event to complete by taking this
    // event handler and pushing it on the event queue allows the
    // selection to be removed by the default handler once it bubbles
    // up.
    private static withTimeout(callback: () => void) {
        setTimeout(() => callback(), 1);
    }

    private static targetElementForEvent(event: MouseEvent | TouchEvent): HTMLElement | undefined {

        if (event.target instanceof Node) {

            if (event.target instanceof HTMLElement) {
                return event.target;
            } else {
                return event.target.parentElement!;
            }

        } else {
            log.warn("Event target is not node: ", event.target);
        }

        return undefined;

    }

    private static hasActiveTextSelection(selection: Selection) {

        const ranges = Selections.toRanges(selection);

        for (const range of ranges) {
            if (Ranges.hasText(range)) {
                return true;
            }
        }

        return false;

    }

    private static eventToPoint(event: MouseEvent | TouchEvent) {

        if ('offsetX' in event) {

            return {
                x: event.offsetX,
                y: event.offsetY
            };

        }

        if (! event.target) {
            throw new Error("No target");
        }

        if (event.changedTouches.length === 0) {
            log.warn("No touches found in event: " , event);
            throw new Error("No touches");
        }

        const rect = (<HTMLElement> event.target).getBoundingClientRect();

        const x = event.changedTouches[0].pageX - rect.left;
        const y = event.changedTouches[0].pageY - rect.top;

        return {x, y};

    }


}

export interface ActiveSelectionListener {
    // noinspection TsLint
    (event: ActiveSelectionEvent): void;
}


export interface ActiveSelection {

    readonly element: HTMLElement;
    readonly originPoint: Point;
    readonly mouseDirection: MouseDirection;
    readonly boundingClientRect: ClientRect | DOMRect;

    /**
     * The actual selection object that we're working with.
     */
    readonly selection: Selection;

    readonly view: Window;

    readonly type: ActiveSelectionType;

}

export type ActiveSelectionType = 'created' | 'destroyed';

export interface ActiveSelectionEvent extends ActiveSelection {

}
