import React from "react";

interface IUseFakePinchToZoomArgs {
    elemRef: React.RefObject<HTMLElement>;
    wrapperRef: React.RefObject<HTMLElement>;
    onZoom: (scale: number) => void;
    shouldUpdate: (scale: number) => boolean;
    enabled?: boolean;
    transformOriginOffset?: [number, number];
}

export type UsePinchMoveHandler = (arg: { delta: number, initial: [number, number] }) => void;

export const useFakePinchToZoom = ({
    elemRef,
    wrapperRef,
    shouldUpdate,
    onZoom,
    enabled = true,
}: IUseFakePinchToZoomArgs) => {
    const pinchingRef = React.useRef<boolean>(false);
    const zoomRef     = React.useRef(1);

    const onMove: UsePinchMoveHandler = React.useCallback(({ delta }) => {
        const elem = elemRef.current!;
        const wrapper = wrapperRef.current!;
        const newScale = zoomRef.current + (delta / window.innerWidth);
        if (!shouldUpdate(newScale)) {
            return;
        }
        zoomRef.current = newScale;

        if (!pinchingRef.current) {
            const elemRect = elem.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            const x = -elemRect.left + wrapperRect.left, y = -elemRect.top + wrapperRect.top;
            elem.style.transformOrigin = `${x}px ${y}px`;
            elem.style.willChange = "transform";
            pinchingRef.current = true;
        }
        elem.style.transform = `scale(${newScale})`;
    }, [zoomRef, pinchingRef, shouldUpdate, elemRef, wrapperRef]);

    const onFinish = React.useCallback(() => {
        const elem = elemRef.current!;
        pinchingRef.current = false;
        elem.removeAttribute('style');
        onZoom(zoomRef.current);
        zoomRef.current = 1;
    }, [zoomRef, onZoom, elemRef]);

    usePinch({
        elemRef,
        onMove,
        onFinish,
        enabled: enabled && !!elemRef.current && !!wrapperRef.current,
    });
};

type UsePinchConfig = {
    elemRef: React.RefObject<HTMLElement>;
    onMove: UsePinchMoveHandler;
    onFinish: () => void;
    enabled?: boolean;
};

export const usePinch = ({ elemRef, onMove, onFinish, enabled = true }: UsePinchConfig) => {

    React.useEffect(() => {
        if (!elemRef.current || !enabled) {
            return;
        }
        let startX = 0, startY = 0;
        let initialDelta = 0;
        let prevDelta = 0;

        const reset = () => {
            startX = startY = initialDelta = 0;
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
                startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
                initialDelta = Math.hypot(
                    (e.touches[1].pageX - e.touches[0].pageX),
                    (e.touches[1].pageY - e.touches[0].pageY)
                );
                prevDelta = initialDelta;
            } else {
                initialDelta = 0;
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            if (initialDelta <= 0 || e.touches.length < 2) {
                return;
            }
            if (e.cancelable) {
                e.preventDefault();
            }

            const delta = Math.hypot(
                (e.touches[1].pageX - e.touches[0].pageX),
                (e.touches[1].pageY - e.touches[0].pageY)
            );

            onMove({ delta: delta - prevDelta, initial: [startX, startY] });
            prevDelta = delta;
        };

        const onTouchEnd = (_: TouchEvent) => {
            if (initialDelta <= 0) {
                return;
            }

            onFinish();
            reset();
        };
        const elem = elemRef.current;

        elem.addEventListener("touchstart", onTouchStart);
        elem.addEventListener("touchmove", onTouchMove, { passive: false });
        elem.addEventListener("touchend", onTouchEnd);
        elem.addEventListener("touchcancel", onTouchEnd);

        return () => {
            elem.removeEventListener("touchstart", onTouchStart);
            elem.removeEventListener("touchmove", onTouchMove);
            elem.removeEventListener("touchend", onTouchEnd);
            elem.removeEventListener("touchcancel", onTouchEnd);
        };
    }, [onFinish, onMove, enabled, elemRef]);
}
