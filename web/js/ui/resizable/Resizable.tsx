import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {VerticalLine} from './VerticalLine';
import {HorizontalLine} from "./HorizontalLine";
import {IPoint} from "../../Point";
import {Rects} from "../../Rects";
import {ILTBRRects} from "polar-shared/src/util/rects/ILTBRRects";

export type ResizableBounds = 'parent';

interface IProps {

    readonly id?: string;
    readonly color: string;
    readonly document?: Document;
    readonly window?: Window;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly resizeAxis?: 'y';
    readonly computeInitialPosition: () => ILTRect;
    readonly onResized?: (resizeRect: ILTRect, direction: Direction) => void;
    readonly onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    readonly bounds?: ResizableBounds;

    /**
     * CSS properties for the resize handles.
     */
    readonly resizeHandleStyle?: React.CSSProperties;

}

export type Direction = 'top' | 'bottom' | 'left' | 'right';

type MouseEventHandler = (event: MouseEvent) => void;

// FIXME: I need to add support for positioning based on the positioned ancestor
// a box might have default positioning so position 'absolute' won't work to
// position it ... this is going to require some more work
export const Resizable = deepMemo((props: IProps) => {

    const [position, setPosition] = React.useState<ILTRect>(props.computeInitialPosition())

    // the position while we're resizing then truncated to compute the position
    const resizingPositionRef = React.useRef(position);

    const mouseDown = React.useRef(false);
    const mouseEventOrigin = React.useRef<IPoint | undefined>(undefined);
    const mouseMoveHandler = React.useRef<MouseEventHandler | undefined>(undefined);
    const elementRef = React.useRef<HTMLElement | null>();

    const win = props.window || window;
    const doc = props.document || document;

    const computeBoundsParentElement = React.useCallback(() => {

        return elementRef.current?.parentElement;

    }, [elementRef.current]);

    const computeBoundsParentElementRect = React.useCallback((): ILTRect => {

        const boundsParentElement = computeBoundsParentElement();

        if (boundsParentElement) {
            return Rects.createFromOffset(boundsParentElement);
        }

        return Rects.createFromOffset(doc.body);

    }, [elementRef.current]);

    const toggleUserSelect = (resizing: boolean) => {
        // this is a hack to disable user select of the document to prevent
        // parts of the UI from being selected

        if (resizing) {
            doc.body.style.userSelect = 'none';
        } else {
            doc.body.style.userSelect = 'auto';
        }

    };

    const toggleCursor = (direction: Direction | undefined) => {

        if (! direction) {
            doc.body.style.cursor = 'auto';
            return;
        }

        function computeCursor(direction: Direction) {

            switch(direction) {
                case "top":
                    return 'row-resize';
                case "bottom":
                    return 'row-resize';
                case "left":
                    return 'col-resize';
                case "right":
                    return 'col-resize';
            }

        }

        doc.body.style.cursor = computeCursor(direction);

    }

    function updatePosition(position: ILTRect, direction: Direction) {
        setPosition(position);

        if (props.onResized) {
            props.onResized(position, direction);
        }

    }

    const handleMouseUp = React.useCallback(() => {
        mouseDown.current = false;
        toggleUserSelect(false);
        toggleCursor(undefined);
        win.removeEventListener('mousemove', mouseMoveHandler.current!);
    }, []);

    const handleMouseMove = React.useCallback((event: MouseEvent, direction: Direction) => {

        if (! mouseDown.current) {
            // the mouse wasn't clicked here...
            return;
        }

        const origin = mouseEventOrigin.current!;

        const delta = {
            x: event.clientX - origin.x,
            y: event.clientY - origin.y
        };

        /**
         * Compute the position raw/directly from the current delta.
         */
        function computeResizingPosition(): ILTRect {

            switch (direction) {

                case "top":
                    return {
                        ...resizingPositionRef.current,
                        top: Math.min(resizingPositionRef.current.top + delta.y,
                                      resizingPositionRef.current.top + resizingPositionRef.current.height),
                        height: Math.max(resizingPositionRef.current.height - delta.y, 0)
                    };
                case "bottom":
                    return {
                        ...resizingPositionRef.current,
                        height: resizingPositionRef.current.height + delta.y
                    };
                case "left":
                    return {
                        ...resizingPositionRef.current,
                        left: Math.min(resizingPositionRef.current.left + delta.x,
                                       resizingPositionRef.current.left + resizingPositionRef.current.width),
                        width: Math.max(resizingPositionRef.current.width - delta.x, 0)
                    };
                case "right":
                    return {
                        ...resizingPositionRef.current,
                        width: resizingPositionRef.current.width + delta.x,
                    };

            }
        }

        /**
         * Compute the new position but factor in bounds too.
         */
        function computePosition(): ILTRect {

            const resizingPosition = computeResizingPosition();

            if (props.bounds) {

                const boundsParentElementRect = computeBoundsParentElementRect();

                const boundedLTRB = {
                    left: Math.max(resizingPosition.left, 0),
                    top: Math.max(resizingPosition.top, 0),
                    right: Math.min(resizingPosition.left + resizingPosition.width, boundsParentElementRect.width),
                    bottom: Math.min(resizingPosition.top + resizingPosition.height, boundsParentElementRect.height)
                }

                return ILTBRRects.toLTRect(boundedLTRB)

            }

            return resizingPosition;

        }

        resizingPositionRef.current = computeResizingPosition();

        updatePosition(computePosition(), direction);
        mouseEventOrigin.current = event;

    }, []);

    const handleMouseDown = React.useCallback((event: React.MouseEvent, direction: Direction) => {
        mouseDown.current = true;
        mouseEventOrigin.current = {x: event.clientX, y: event.clientY};

        toggleUserSelect(true);
        toggleCursor(direction);

        mouseMoveHandler.current = (event: MouseEvent) => handleMouseMove(event, direction);

        win.addEventListener('mousemove', mouseMoveHandler.current!);

        win.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            handleMouseUp();
        }, {once: true});

    }, []);

    const style: React.CSSProperties = {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        overflow: 'none'
    }

    return (

        <div id={props.id}
             style={{...style, ...props.style}}
             ref={ref => elementRef.current = ref}
             draggable={false}
             className={props.className}
             onContextMenu={props.onContextMenu}>

            <VerticalLine side="left"
                          color={props.color}
                          height={position.height}
                          onMouseDown={event => handleMouseDown(event, 'left')}
                          onMouseUp={handleMouseUp}/>

            <VerticalLine side="right"
                          color={props.color}
                          height={position.height}
                          onMouseDown={event => handleMouseDown(event, 'right')}
                          onMouseUp={handleMouseUp}/>

            <HorizontalLine side="top"
                            color={props.color}
                            width={position.width}
                            onMouseDown={event => handleMouseDown(event, 'top')}
                            onMouseUp={handleMouseUp}/>

            <HorizontalLine side="bottom"
                            color={props.color}
                            width={position.width}
                            onMouseDown={event => handleMouseDown(event, 'bottom')}
                            onMouseUp={handleMouseUp}/>

        </div>

    );

})

export namespace HTMLElements {

    /**
     * Search backwards in the DOM to find the most positioned ancestor or
     * the current element if it's positioned.
     */
    export function findPositionedAncestor(element: HTMLElement): HTMLElement | undefined {

        if (element.style.position !== null && element.style.position !== 'static') {
            return element;
        }

        if (element.parentElement) {
            return findPositionedAncestor(element.parentElement);
        }

        return undefined;

    }

    export function computeOffset(parent: HTMLElement, child: HTMLElement): IPoint {

        const parentBCR = parent.getBoundingClientRect();
        const childBCR = child.getBoundingClientRect();

        const x = childBCR.x - parentBCR.x;
        const y = childBCR.y - parentBCR.y

        return {x, y};

    }

}
