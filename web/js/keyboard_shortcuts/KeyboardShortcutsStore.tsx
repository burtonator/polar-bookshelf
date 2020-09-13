import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {Arrays} from "polar-shared/src/util/Arrays";

export type KeyboardEventHandler = (event: KeyboardEvent) => void;

export type KeyboardEventHandlerUsingPredicate = (event: KeyboardEvent) => boolean;

export type KeyBinding = string;

export interface IBaseKeyboardShortcut {
    readonly name: string;
    readonly description?: string;
    readonly sequences: ReadonlyArray<KeyBinding>;
    readonly priority?: number;
}

export interface IKeyboardShortcut extends IBaseKeyboardShortcut {
    readonly group?: string;
}

export interface IKeyboardShortcutWithHandler extends IKeyboardShortcut {
    readonly handler: KeyboardEventHandler;
}

interface IKeyboardShortcutsStore {

    /**
     * The current keyboard bindings.
     */
    readonly shortcuts: {[binding: string]: IKeyboardShortcutWithHandler};

    /**
     * True when the keyboard bindings are active so we could disable them
     * temporarily.
     */
    readonly active: boolean;

}

interface IKeyboardShortcutsCallbacks {
    readonly addKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly removeKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly setActive: (active: boolean) => void;
}

const initialStore: IKeyboardShortcutsStore = {
    shortcuts: {},
    active: true
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                        setStore: SetStore<IKeyboardShortcutsStore>): Mutator {
    return {};
}

function callbacksFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                          setStore: (store: IKeyboardShortcutsStore) => void,
                          mutator: Mutator): IKeyboardShortcutsCallbacks {

    function addKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        shortcuts[sequence] = shortcut;
        setStore({...store, shortcuts});
    }

    function removeKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        delete shortcuts[sequence];
        setStore({...store, shortcuts});
    }

    function setActive(active: boolean) {
        const store = storeProvider();
        setStore({...store, active});
    }

    return {addKeyboardShortcut, removeKeyboardShortcut, setActive};

}

export const [KeyboardShortcutsStoreProvider, useKeyboardShortcutsStore, useKeyboardShortcutsCallbacks, useKeyboardShortcutsMutator]
    = createObservableStore<IKeyboardShortcutsStore, Mutator, IKeyboardShortcutsCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

