import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import {deepMemo} from "../../react/ReactUtils";

/**
 * This will block key event listeners from running in the window until
 * this component is unmounted.  This has to be used by modal dialogs to prevent
 * the top level keyboard listeners from accidentally being invoked.
 */
function useBlockWindowKeyEventListeners() {

    const handler = React.useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('keypress', handler, {capture: true});
        window.addEventListener('keydown', handler, {capture: true});
        window.addEventListener('keyup', handler, {capture: true});
    })

    useComponentWillUnmount(() => {
        window.removeEventListener('keypress', handler, {capture: true});
        window.removeEventListener('keydown', handler, {capture: true});
        window.removeEventListener('keyup', handler, {capture: true});
    })

}

interface IProps {
    readonly children: React.ReactElement;
}

export const BlockWindowKeyEventListeners = deepMemo((props: IProps) => {
    useBlockWindowKeyEventListeners();
    return props.children;
});
