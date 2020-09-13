import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {IScrollTarget} from "./ScrollIntoViewUsingLocation";

export type InitialScrollLoader = (scrollTarget: IScrollTarget, ref: HTMLElement | null) => void;

interface IUseLocationChangeStore {
    readonly initialScrollLoader: InitialScrollLoader;
}

interface IUseLocationChangeCallbacks {
    setInitialScrollLoader: (initialScrollLoader: InitialScrollLoader) => void;
}

const initialStore: IUseLocationChangeStore = {
    initialScrollLoader: () => console.warn("Using null initialScrollLoader")
};

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IUseLocationChangeStore>,
                        setStore: SetStore<IUseLocationChangeStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IUseLocationChangeStore>,
                          setStore: (store: IUseLocationChangeStore) => void,
                          mutator: Mutator): IUseLocationChangeCallbacks {

    function setInitialScrollLoader(initialScrollLoader: InitialScrollLoader) {
        const store = storeProvider();
        setStore({...store, initialScrollLoader});
    }

    return {
        setInitialScrollLoader
    };

}

export const [UseLocationChangeStoreProvider, useLocationChangeStore, useUseLocationChangeCallbacks, useUseLocationChangeMutator]
    = createObservableStore<IUseLocationChangeStore, Mutator, IUseLocationChangeCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

