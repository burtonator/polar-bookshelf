import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {
    IKeyboardShortcutWithHandler,
    KeyBinding,
    KeyboardEventHandler,
    useKeyboardShortcutsStore,
    KeyboardEventHandlerUsingPredicate
} from "./KeyboardShortcutsStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useRefProvider, useRefWithUpdates} from '../hooks/ReactHooks';

type KeyboardEventHandlerPredicate = (event: KeyboardEvent) => boolean;

function createPredicate2(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    return (event) => {

        function matchesKey0() {

            const key = keys[0];

            // console.log("keyboard shortcuts: key: " + key);
            // console.log("keyboard shortcuts: ctrlKey: " + event.ctrlKey);
            // console.log("keyboard shortcuts: metaKey: " + event.metaKey);
            // console.log("keyboard shortcuts: shiftKey: " + event.shiftKey);

            if (key === 'ctrl' && event.ctrlKey) {
                return true;
            }

            if (key === 'command' && event.metaKey) {
                return true;
            }

            if (key === 'shift' && event.shiftKey) {
                return true;
            }

            return false;

        }


        function matchesKey1() {

            const key = keys[1];

            if (key === event.key) {
                return true;
            }

            return false;

        }

        if (matchesKey0() && matchesKey1()) {
            return true;
        }

        return false;

    }

}

function createPredicate1(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    return (event): boolean => {
        return event.key === keys[0];
    }

}

function createHandler(sequence: KeyBinding, handler: KeyboardEventHandler): KeyboardEventHandlerUsingPredicate {

    const keys = sequence.split('+');

    function createPredicate() {
        switch (keys.length) {
            case 1:
                return createPredicate1(keys);
            case 2:
                return createPredicate2(keys);
            default:
                throw new Error("Too many keys for event: " + keys.length);
        }

    }

    const predicate = createPredicate();

    return (event) => {

        if (predicate(event)) {
            event.stopPropagation();
            event.preventDefault();

            setTimeout(() => handler(event), 1);
            return true;
        }

        return false;

    }

}

type SequenceToHandler = [string, KeyboardEventHandler];
type SequenceToKeyboardEventHandlerPredicate = [string, KeyboardEventHandlerPredicate];

export const KeyboardShortcuts = deepMemo(() => {

    const {shortcuts, active} = useKeyboardShortcutsStore(['shortcuts', 'active']);
    const shortcutsRef = useRefWithUpdates(shortcuts);
    const activeRef = useRefWithUpdates(active);

    function computeKeyToHandlers() {

        function toKeyToHandler(keyboardShortcut: IKeyboardShortcutWithHandler):

            ReadonlyArray<SequenceToKeyboardEventHandlerPredicate> {

            function toKeyboardEventHandlerPredicate(seq: string) {
                return createHandler(seq, keyboardShortcut.handler);
            }

            return keyboardShortcut.sequences.map(seq => ([seq, toKeyboardEventHandlerPredicate(seq)]));

        }

        return arrayStream(Object.values(shortcutsRef.current))
            .flatMap(toKeyToHandler)
            .collect();

    }

    const keyToHandlers = useRefProvider(() =>  computeKeyToHandlers());

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (! activeRef.current) {
            // key bindings are deactivated.
            return;
        }

        for (const keyToHandler of keyToHandlers.current) {

            const handler = keyToHandler[1];

            if (handler(event)) {
                break;
            }

        }

    }, []);

    const register = React.useCallback(() => {
        window.addEventListener('keydown', handleKeyDown)
    }, [])

    const unregister = React.useCallback(() => {
        window.removeEventListener('keydown', handleKeyDown)
    }, [])

    unregister();
    register();

    useComponentWillUnmount(() => {
        unregister();
    })

    return null;

});
