import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {Highlights} from "./Highlights";
import {useScrollIntoViewUsingLocation} from "../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation";
import intersectsWithWindow = Highlights.intersectsWithWindow;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {useSidenavDocumentChangeCallback} from "../../../apps/doc/src/renderers/UseSidenavDocumentChangeCallbackHook";
import {Functions} from "polar-shared/src/util/Functions";
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps extends IHighlightViewportPosition {
    readonly id: string;
    readonly color?: string;
    readonly className?: string;
    readonly onClick: React.EventHandler<React.MouseEvent>;
}

function useSideNavDocChangeActivated() {

    const [iter, setIter] = React.useState(0);

    useSidenavDocumentChangeCallback(() => {
        Functions.withTimeout(() => setIter(Date.now));
    });

    return iter;

}

/**
 * Handles rendering a single row of non-overflow text.
 */
export const DOMHighlightRow = deepMemo(function DOMHighlightRow(props: IProps) {

    const scrollIntoViewRef = useScrollIntoViewUsingLocation();
    useSideNavDocChangeActivated();
    const theme = useTheme();
    const useMinimalUI = ! intersectsWithWindow(props);

    // we use the absolute position so that on scroll nothing is actually updated
    const absolutePosition = Highlights.fixedToAbsolute(props);

    const backgroundColor = props.color || 'rgba(255, 255, 0, 0.5)';

    if (useMinimalUI) {

        return (
            <div id={props.id}
                 ref={scrollIntoViewRef}
                 className={props.className}
                 style={{
                     position: 'absolute',
                     ...absolutePosition
                 }}>
            </div>
        );

    } else {

        const dataAttributes = Dictionaries.dataAttributes(props);

        return (
            <div id={props.id}
                 ref={scrollIntoViewRef}
                 {...dataAttributes}
                 className={"polar-ui " + props.className || ''}
                 style={{
                     backgroundColor: `${backgroundColor}`,
                     position: 'absolute',
                     zIndex: 1,
                     mixBlendMode: theme.palette.type === 'light' ? 'multiply' : 'screen',
                     ...absolutePosition
                 }}>
            </div>
        );

    }

});
