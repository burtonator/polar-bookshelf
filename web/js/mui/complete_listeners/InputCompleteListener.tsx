import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";
import {Providers} from "polar-shared/src/util/Providers";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";

export function isInputCompleteEvent(event: KeyboardEvent) {
    return event.key === 'Enter';
}

interface InputCompleteListenerOpts {

    readonly onComplete: () => void;

    readonly onCancel?: Callback;

    /**
     * Provide a function which returns true if input is completable.
     */
    readonly completable?: () => boolean;

}

export function useInputCompleteListener(opts: InputCompleteListenerOpts) {

    const completable = opts.completable || Providers.of(true);

    const onKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (! completable()) {
            return;
        }

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            opts.onComplete();
            return;
        }

        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
            return;
        }

    }, []);

    useComponentDidMount(() => {
        window.addEventListener('keydown', onKeyDown, {capture: true});
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('keydown', onKeyDown, {capture: true});
    });

}

interface IProps extends InputCompleteListenerOpts {

    readonly children: JSX.Element;

}

export const InputCompleteListener = deepMemo((props: IProps) => {

    useInputCompleteListener(props);

    return props.children;

});
