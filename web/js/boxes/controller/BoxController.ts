import {BoxMoveEvent} from './BoxMoveEvent';
import {BoxOptions} from './BoxOptions';
import {Rects} from '../../Rects';
import {Rect} from '../../Rect';
import {Objects} from '../../util/Objects';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {RectEdges} from '../../pagemarks/controller/interact/edges/RectEdges';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DragRectAdjacencyCalculator} from '../../pagemarks/controller/interact/drag/DragRectAdjacencyCalculator';
import {ResizeRectAdjacencyCalculator} from '../../pagemarks/controller/interact/resize/ResizeRectAdjacencyCalculator';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

import interact from 'interactjs';

const log = Logger.create();

/**
 * A generic controller for dragging boxes (divs) which are resizeable and can
 * be dragged within a container and absolutely positioned.
 */
export class BoxController {

    private readonly onMove: (event: BoxMoveEvent) => void;

    constructor(onMove: (event: BoxMoveEvent) => void = NULL_FUNCTION) {

        this.onMove = onMove;

    }

    /**
     */
    public register(opts: BoxOptions) {

        const boxOptions = new BoxOptions(opts);

        // TODO: assert that the boxes for the selector are ALREADY absolutely
        // positioned before we accept them and they are done using style
        // attributes because we're incompatible with them otherwise.

        const restrictionElement =
            Optional.of(boxOptions.restrictionElement)
                    .getOrElse(boxOptions.target.parentElement!);

        interact(boxOptions.target)
            .draggable({

                inertia: false,
                restrict: {
                    restriction: restrictionElement,
                    outer: 'parent',

                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },

                restrictEdges: {
                    outer: 'parent',
                    // outer: computeRestriction,
                },

            })
            .resizable( {

                // resize from all edges and corners
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                },

                // Keep the edges inside the parent. this is needed or else the
                // bound stretches slightly beyond the container.
                restrictEdges: {
                    outer: restrictionElement,
                    // outer: computeRestriction,
                },

                restrict: {
                    restriction: restrictionElement,
                    // restriction: computeRestriction
                },

                // minimum size
                restrictSize: {
                    min: { width: 50, height: 50 },
                },

                inertia: false,

            })
            .on('dragstart', (interactionEvent: any) => {
                this._captureStartTargetRect(interactionEvent);
            })
            .on('dragmove', (interactionEvent: any) => {

                // log.info("=====================")
                // log.info("dragmove: event: ", event);
                // log.info("dragmove: event.interaction.myTimestamp: ",
                // event.interaction.myTimestamp); log.info("dragmove:
                // event.target: ", event.target); log.info("dragmove:
                // event.restrict: ", event.restrict); log.info(`dragmove:
                // event.dx: ${event.dx} and event.dy: ${event.dy}`);
                // log.info(`dragmove: event.x0: ${event.x0} and event.y0:
                // ${event.y0}`); log.info(`dragmove: event.clientX:
                // ${event.clientX} and event.clientY: ${event.clientY}`);
                // log.info(`dragmove: event.clientX0: ${event.clientX0} and
                // event.clientY0: ${event.clientY0}`);

                if (! interactionEvent.currentTarget.parentElement) {
                    // we've been removed from the DOM but we're still getting
                    // drag events so we should yield.
                    return;
                }

                const target = interactionEvent.target;

                const restrictionRect = Rects.createFromBasicRect({
                    left: 0,
                    top: 0,
                    width: restrictionElement.offsetWidth,
                    height: restrictionElement.offsetHeight
                });

                const origin = this._computeOriginXY(interactionEvent);

                const targetRect = Rects.fromElementStyle(target);

                const intersectedBoxes = this._calculateIntersectedBoxes(interactionEvent.currentTarget, Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                }), boxOptions.intersectedElementsSelector);

                let boxRect = Rects.createFromBasicRect({
                    left: origin.x,
                    top: origin.y,
                    width: targetRect.width,
                    height: targetRect.height
                });

                if (intersectedBoxes.intersectedRects.length === 0) {

                    log.info("NOT INTERSECTED");

                    log.info("Moving to origin: " + JSON.stringify(origin));
                    this._moveTargetElement(origin.x, origin.y, target);

                } else {

                    log.info("INTERSECTED========== ");

                    const primaryRect = Rects.createFromBasicRect({
                        left: origin.x,
                        top: origin.y,
                        width: targetRect.width,
                        height: targetRect.height
                    });

                    const intersectedRect = intersectedBoxes.intersectedRects[0];

                    const adjacency = DragRectAdjacencyCalculator.calculate(primaryRect, intersectedRect, restrictionRect);

                    const adjustedRect = adjacency.adjustedRect;

                    if (adjustedRect) {
                        this._moveTargetElement(adjustedRect.left, adjustedRect.top, target);
                        boxRect = adjustedRect;

                    } else {
                        // this should never happen but log it if there is a
                        // bug.
                        console.warn("Can't move due to no valid adjustedRect we can work with.");
                    }

                }

                interactionEvent.interaction.lastBoxMoveEvent =
                    this.fireOnMove("drag", restrictionRect, boxRect, target.id, target);

            })
            .on('dragend', (interactionEvent: any) => {
                this.fireOnMoveEnd(interactionEvent);
            })
            .on('resizestart', (interactionEvent: any) => {
                this._captureStartTargetRect(interactionEvent);
                log.info("resizestart: interactionEvent.rect: " + JSON.stringify(interactionEvent.rect, null, "  "));
                interactionEvent.interaction.startRect = Objects.duplicate(interactionEvent.rect);

            })
            .on('resizemove', (interactionEvent: any) => {

                log.info("resizemove: event: ", interactionEvent);
                log.info("resizemove: event.target: ", interactionEvent.target);
                // log.info("resizemove: event.restrict: ",
                // interactionEvent.restrict); log.info("resizemove:
                // interactionEvent.rect: " +
                // JSON.stringify(interactionEvent.rect, null, "  "));
                log.info("resizemove: interactionEvent.interaction.startRect: " + JSON.stringify(interactionEvent.interaction.startRect, null, "  "));

                const target = interactionEvent.target;

                const restrictionRect = Rects.createFromBasicRect({
                    left: 0,
                    top: 0,
                    width: restrictionElement.offsetWidth,
                    height: restrictionElement.offsetHeight
                });

                // the tempRect is the rect that the user has attempted to draw
                // but which we have not yet accepted and is controlled by
                // interact.js

                const tempRect = Rects.createFromBasicRect(interactionEvent.rect);

                const deltaRect = Rects.subtract(tempRect, interactionEvent.interaction.startRect);

                const resizeRect = Rects.add(interactionEvent.interaction.startTargetRect, deltaRect);

                // before we resize, verify that we CAN resize..

                const intersectedBoxes = this._calculateIntersectedBoxes(target, resizeRect, boxOptions.intersectedElementsSelector);

                log.info("resizemove: deltaRect: " + JSON.stringify(deltaRect, null, "  "));

                let boxRect;

                if (intersectedBoxes.intersectedRects.length === 0) {

                    log.info("Resizing in non-intersected mode");

                    boxRect = resizeRect;

                    this._resizeTargetElement(resizeRect, target);

                } else {

                    // FIXME: its' also possible to resize smaller than the
                    // minSize we defined above...

                    // FIXME: when intersected, if we drag down, the rect
                    // vanishes...  FIXME: pulling it left while intersected
                    // also makes it vanish...

                    log.info("Resizing in intersected mode");

                    const resizeRectAdjacencyCalculator = new ResizeRectAdjacencyCalculator();

                    const intersectedRect = intersectedBoxes.intersectedRects[0];

                    const rectEdges = new RectEdges(interactionEvent.edges);

                    const adjustedRect = resizeRectAdjacencyCalculator.calculate(resizeRect, intersectedRect, rectEdges);

                    log.info("resizemove: adjustedRect: " + JSON.stringify(adjustedRect, null, "  "));

                    boxRect = adjustedRect;

                    this._resizeTargetElement(adjustedRect, target);

                }

                interactionEvent.interaction.lastBoxMoveEvent
                    = this.fireOnMove("resize", restrictionRect, boxRect, target.id, target);

            })
            .on('resizeend', (interactionEvent: any) => {
                this.fireOnMoveEnd(interactionEvent);
            });

    }

    private fireOnMove(type: 'drag' | 'resize',
                       restrictionRect: Rect,
                       boxRect: Rect,
                       id: string,
                       target: HTMLElement) {

        const boxMoveEvent = new BoxMoveEvent({
            type,
            restrictionRect,
            boxRect,
            id,
            target,
        });

        if (this.onMove) {
            this.onMove(boxMoveEvent);
        }

        return boxMoveEvent;

    }


    private fireOnMoveEnd(interactionEvent: any) {

        if (interactionEvent.interaction.lastBoxMoveEvent) {

            const boxMoveEvent = Object.assign({}, interactionEvent.interaction.lastBoxMoveEvent);

            boxMoveEvent.state = "completed";

            if (this.onMove) {
                log.info("Firing completed BoxMoveEvent: ", boxMoveEvent);

                // for some reason, without a timeout, the controller just seems
                // to lock up.
                setTimeout(() => this.onMove(boxMoveEvent), 1);

            }

        }

    }

    /**
     */
    private _calculateIntersectedBoxes(element: HTMLElement, resizeRect: Rect, intersectedElementsSelector: string) {

        Preconditions.assertNotNull(element, "element");
        Preconditions.assertNotNull(resizeRect, "resizeRect");
        Preconditions.assertNotNull(intersectedElementsSelector, "intersectedElementsSelector");


        // // This is where we are NOW, now where we are GOING to be.
        // let elementRect = Rects.fromElementStyle(element);

        // log.info(`x: ${x}: y: ${y}`);
        log.info("_calculateIntersectedBoxes: resizeRect is: " + JSON.stringify(resizeRect, null, "  "));

        // TODO: it looks like there's an issue with parentElement being missing
        // here.  If the parentElement is missing I probably need to ignore the
        // intersected boxes?

        if (! element.parentElement) {
            const msg = "Element not within DOM: ";
            log.error(msg, element);
            throw new Error(msg);
        }

        const intersectedElements = element.parentElement!.querySelectorAll(intersectedElementsSelector);

        const boxes: HTMLElement[]
            = Array.from(intersectedElements)
                             .filter(current => current !== element)
                             .map(current => current as HTMLElement);

        // make sure that our boxes aren't the same ID as the element. we can
        // remove this when we go to production
        boxes.forEach(current => current.getAttribute("id") !== element.getAttribute("id"));

        const intersectedRects: Rect[] = [];

        boxes.forEach(box => {

            const boxRect = Rects.fromElementStyle(box);

            if (Rects.intersect(boxRect, resizeRect)) {
                intersectedRects.push(boxRect);
            }

        });

        return {
            resizeRect,
            intersectedRects
        };

    }

    /**
     *
     * @param interactionEvent
     * @private
     */
    private _computeOriginXY(interactionEvent: any) {

        const delta = {
            x: interactionEvent.pageX - interactionEvent._interaction.coords.start.page.x,
            y: interactionEvent.pageY - interactionEvent._interaction.coords.start.page.y
        };

        // log.info(`dragmove: delta.x: ${delta.x} and delta.y: ${delta.y}`);
        // log.info(`dragmove: interactionEvent.interaction.startCoords.page: `
        // + JSON.stringify(interactionEvent.interaction.startCoords.page) );
        // log.info(`dragmove: testDelta: ` + JSON.stringify(delta));

        const x = interactionEvent.interaction.startTargetRect.left + delta.x;
        const y = interactionEvent.interaction.startTargetRect.top + delta.y;

        return {x, y};

    }


    private _moveTargetElement(x: number, y: number, target: HTMLElement) {

        target.style.left = `${x}px`;
        target.style.top = `${y}px`;

        // update the position attributes
        target.setAttribute('data-x', `${x}`);
        target.setAttribute('data-y', `${y}`);

        // updateTargetText(target);

    }

    private _resizeTargetElement(rect: Rect, target: HTMLElement) {

        // first move it the same way as if it were dragged
        this._moveTargetElement(rect.left, rect.top, target);

        // now set the width and height
        target.style.width  = `${rect.width}px`;
        target.style.height = `${rect.height}px`;

    }

    private _captureStartTargetRect(interactionEvent: any) {
        // this modifies interactionEvent.interaction by side effect which I
        // don't like.
        interactionEvent.interaction.startTargetRect = Rects.fromElementStyle(interactionEvent.target);
    }

}
