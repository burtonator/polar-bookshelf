import {Provider} from "polar-shared/src/util/Providers";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import {
    createObservableStore,
    SetStore
} from "../../../../../web/js/react/store/ObservableStore";
import { useDocViewerStore } from "../../DocViewerStore";

export interface IEPUBFinderStore {

    // the hits or the current 'find' or undefined if no search is active.
    readonly hits: ReadonlyArray<DOMTextHit> | undefined;
    readonly current: number | undefined;

}

export interface DOMTextHitWithIndex extends DOMTextHit {
    readonly idx: number;
    readonly pageNum: number;
}

export interface IEPUBFinderCallbacks {

    readonly setHits: (hits: ReadonlyArray<DOMTextHit>) => void;
    readonly setCurrent: (current: number) => void;

    readonly prev: () => DOMTextHitWithIndex | undefined;
    readonly next: () => DOMTextHitWithIndex | undefined;

    readonly reset: () => void;

}

const initialStore: IEPUBFinderStore = {
    hits: undefined,
    current: undefined
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IEPUBFinderStore>,
                        setStore: SetStore<IEPUBFinderStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IEPUBFinderStore>,
                          setStore: (store: IEPUBFinderStore) => void,
                          mutator: Mutator): IEPUBFinderCallbacks {

    const {page} = useDocViewerStore(['page']);

    function setHits(hits: ReadonlyArray<DOMTextHit>) {
        const store = storeProvider();
        setStore({...store, hits, current: -1});
    }

    function setCurrent(current: number) {
        const store = storeProvider();
        setStore({...store, current});
    }

    function reset() {
        const store = storeProvider();
        setStore({...store, hits: undefined, current: undefined});
    }

    function changeCurrent(delta: number): DOMTextHitWithIndex | undefined {

        const store = storeProvider();

        if (store.hits === undefined || store.current === undefined) {
            return undefined;
        }

        const newCurrent = store.current + delta;

        // compute start + end inclusive

        const min = 0;
        const max = (store.hits.length - 1);

        if (newCurrent >= min && newCurrent <= max) {
            setStore({...store, current: newCurrent});

            const hit = store.hits[newCurrent];

            return {
                idx: newCurrent,
                pageNum: page,
                ...hit
            };

        }

        return undefined;

    }

    function next() {
        return changeCurrent(1);
    }

    function prev() {
        return changeCurrent(-1);
    }

    return {setHits, setCurrent, reset, next, prev};

}

const observableStore = createObservableStore<IEPUBFinderStore, Mutator, IEPUBFinderCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});


export const [
    EPUBFinderProvider,
    useEPUBFinderStore,
    useEPUBFinderCallbacks,
    useEPUBFinderMutator
] = observableStore;
