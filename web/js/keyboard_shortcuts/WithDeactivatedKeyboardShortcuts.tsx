import {deepMemo} from "../react/ReactUtils";
import {useKeyboardShortcutsCallbacks} from "./KeyboardShortcutsStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";

interface IProps {
    readonly children: React.ReactElement;
}

export const WithDeactivatedKeyboardShortcuts = deepMemo((props: IProps) => {

    const {setActive} = useKeyboardShortcutsCallbacks();

    useComponentDidMount(() => {
        setActive(false);
    })

    useComponentWillUnmount(() => {
        setActive(true);
    })

    return props.children;

});
