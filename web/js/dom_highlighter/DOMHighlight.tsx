import {deepMemo} from "../react/ReactUtils";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import * as React from "react";
import {
    useWindowResizeEventListener,
    useWindowScrollEventListener
} from "../react/WindowHooks";
import {DOMHighlightRow} from "./DOMHighlightRow";
import {Highlights} from "./Highlights";
import {AnimationFrameDebouncers} from "./AnimationFrameDebouncers";
import withAnimationFrame = AnimationFrameDebouncers.withAnimationFrame;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;
import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps extends DOMTextHit {
    readonly color?: string;
    readonly className?: string;
    readonly onClick?: React.EventHandler<React.MouseEvent>;
}

function toHighlightViewportPositions(regions: ReadonlyArray<NodeTextRegion>) {

    try {
        return Highlights.toHighlightViewportPositions(regions);
    } catch (e) {
        console.error("Unable to handle viewport position: ", e);
        return undefined;
    }

}

/**
 * An individual highlight that might need to be split across rows.
 */
export const DOMHighlight = deepMemo(function DOMHighlight(props: IProps) {

    const {regions, onClick = NULL_FUNCTION} = props;

    const [highlightViewportPositions, setHighlightViewportPositions] = React.useState(toHighlightViewportPositions(regions))

    const redrawCallback = React.useMemo(() => withAnimationFrame(() => {

        if (props.regions.length === 0) {
            // no work to do...
            return;
        }

        setHighlightViewportPositions(toHighlightViewportPositions(regions));

    }), [props.regions.length, regions]);

    const computeWindow = React.useCallback((): Window => {

        // this is a big hacky as we need to figure out which window is holding
        // the node.
        return props.regions[0].node.ownerDocument!.defaultView!;

    }, [props.regions]);

    const win = React.useMemo(() => computeWindow(), [computeWindow]);

    useWindowScrollEventListener('DOMHighlight-scroll-iframe', redrawCallback, {win});
    useWindowResizeEventListener('DOMHighlight-resize-iframe', redrawCallback, {win});

    useWindowScrollEventListener('DOMHighlight-scroll', redrawCallback);
    useWindowResizeEventListener('DOMHighlight-resize', redrawCallback);

    const dataAttributes = Dictionaries.dataAttributes(props);

    function toDOMHighlighterRow(highlightViewportPosition: IHighlightViewportPosition, idx: number) {
        const id = idx === 0 ? props.id : (props.id + ":" + idx);
        const key = `${highlightViewportPosition.nodeID}:${highlightViewportPosition.start}:${highlightViewportPosition.end}`;
        return <DOMHighlightRow {...highlightViewportPosition}
                                {...dataAttributes}
                                color={props.color}
                                onClick={onClick}
                                className={props.className}
                                id={id}
                                key={key}/>
    }

    if (highlightViewportPositions === undefined) {
        return null;
    }

    return (
        <>
            {highlightViewportPositions.map(toDOMHighlighterRow)}
        </>
    );

});
