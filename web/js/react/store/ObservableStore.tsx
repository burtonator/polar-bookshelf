import {Subject} from "rxjs";
import React, {useContext, useState} from "react";
import {Provider} from "polar-shared/src/util/Providers";
import {useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";
import isEqual from "react-fast-compare";

function pick<T, K extends keyof T>(value: T, keys: ReadonlyArray<K>): Pick<T, K> {

    const result: any = {};

    for (const key of keys) {
        result[key] = value[key];
    }

    return result;

}

/**
 * Hook that allows us to just pick specific keys from the store.
 */
function usePick<T, K extends keyof T>(useStoreHook: () => T,
                                       keys: K[]): Pick<T, K> {

    const store = useStoreHook();

    const [value, setValue] = React.useState<Pick<T, K>>(pick(store, keys));

    return value;

}

interface InternalObservableStore<V> {

    /**
     * The underlying rxjs observable for sending off updates to components.
     */
    readonly subject: Subject<V>;

    /**
     * The current value, used for the the initial render of each component
     * and to update it each time so that on useObservableStore we can
     * return the current value.
     */
    current: V;

}


export interface ObservableStore<V> {

    /**
     * The current value, used for the the initial render of each component.
     */
    readonly current: V;

}

export type SetStore<V> = (value: V) => void;
export type Store<V> = [V, SetStore<V>];


export function useObservableStore<V, K extends keyof V>(context: React.Context<ObservableStore<V>>,
                                                         keys: ReadonlyArray<K> | undefined): Pick<V, K> {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const [value, setValue] = useState<V>(internalObservableStore.current);
    const valueRef = React.useRef(value);

    function doUpdateValue(newValue: V) {
        setValue(newValue);
        valueRef.current = newValue;
    }

    const subscriptionRef = React.useRef(internalObservableStore.subject.subscribe((nextValue) => {

        if (keys) {

            // we have received an update but we're only interested in a few
            // keys so compare them.

            const currValue = valueRef.current;

            const nextValuePicked = pick(nextValue, keys);
            const currValuePicked = pick(currValue, keys);

            if (! isEqual(currValuePicked, nextValuePicked)) {
                // the internal current in the context is already updated.
                return doUpdateValue(nextValue);
            }

        } else {

            const currValue = valueRef.current;

            if (! isEqual(currValue, nextValue)) {
                // we can STILL do the lazy comparison here and only
                // update when the value has actually changed.
                return doUpdateValue(nextValue);

            }
        }

    }));

    useComponentWillUnmount(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }
    });

    // return the initial value...
    return value;

}

export type InternalStoreContext<V> = [React.Context<ObservableStore<V>>, InternalObservableStore<V>];

export type StoreContext<V> = [React.Context<ObservableStore<V>>, ObservableStore<V>];

function createInternalObservableStore<V>(initialValue: V): InternalObservableStore<V> {

    const subject = new Subject<V>();
    subject.next(initialValue);

    const store: InternalObservableStore<V> = {
        subject,
        current: initialValue
    }

    return store;

}

function createObservableStoreContext<V>(store: InternalObservableStore<V>): InternalStoreContext<V> {

    const context = React.createContext(store as ObservableStore<V>);

    return [context, store];

}

interface ObservableStoreProps<V> {
    readonly children: JSX.Element | Provider<JSX.Element>;
}

export type ObservableStoreProviderComponent<V> = (props: ObservableStoreProps<V>) => JSX.Element;

/**
 * Hook to listen to store changes. Use undefined to not filter for properties
 * but we don't recommend it.
 */
export type UseStoreHook<V, K extends keyof V> = (keys: ReadonlyArray<K> | undefined) => Pick<V, K>;

export type UseContextHook<V> = () => V;

/**
 * Tag interface just for documentation right now.
 */
export interface StoreMutator {

}

// type FooTuple = [<V extends unknown, K extends keyof V>(keys: ReadonlyArray<K>) => void];

export type ObservableStoreTuple<V, M extends StoreMutator, C> = [
    ObservableStoreProviderComponent<V>,
    // NOTE: it's not possible to use a type for this because V is defined in the tuple
    <K extends keyof V>(keys: ReadonlyArray<K> | undefined) => Pick<V, K>,
    UseContextHook<C>,
    UseContextHook<M>,
];

/**
 * Create the callbacks. Called for every useCallbacks function so that we can
 * call hooks when the callbacks are created. This allows us to use other hooks
 * in our created callbacks.
 */
export type CallbacksFactory<V, M, C> = (storeProvider: Provider<V>, setStore: SetStore<V>, mutator: M) => C;

export type MutatorFactory<V, M> = (storeProvider: Provider<V>, setStore: SetStore<V>) => M;

// TODO: refactor this to take opts and include an initialValue and value ...
// initialValue can be the mock

// TODO: since mutator isn't always needed make it optional and just use defaults
// otherwise

// TODO: since callbacks were designed to work with hooks using it outside of
// a component means it will break.  A mutator can be used if you want to work
// with the store outside of a component.

export interface ObservableStoreOpts<V, M, C> {

    /**
     * The initial value for the store including defaults for every value.
     */
    readonly initialValue: V;

    readonly mutatorFactory: MutatorFactory<V, M>;

    /**
     * Used to create high level callbacks that can be injected into your
     * components with a useXCallbacks hook to mutate your store.  The callback
     * is a singleton and never updated so component memo works.
     */
    readonly callbacksFactory: CallbacksFactory<V, M, C>;

    /**
     * Same functionality as callbacksFactory but used with mocks so that you
     * can work with components using the mock without complex initialization.
     *
     * Used with more production apps so other developers don't need to worry
     * about configuration of our component system.
     *
     * Usually these mocks should just print to the console or perform some
     * action to note that they were called and with what arguments.
     */
    readonly mockCallbacksFactory?: CallbacksFactory<V, M, C>;

}

type ComponentCallbacksFactory<C> = () => C;

type InitialContextValues<V, M, C> = [
    InternalObservableStore<V>,
    M,
    ComponentCallbacksFactory<C>];

/**
 * Create the initial values of the components we're working with (store
 * and callbacks)
 */
function createInitialContextValues<V, M, C>(opts: ObservableStoreOpts<V, M, C>): InitialContextValues<V, M, C> {

    const {initialValue, mutatorFactory, callbacksFactory} = opts;

    const store = createInternalObservableStore(initialValue);

    const setStore = (value: V) => {

        // the current value needs to be set because we have to first update
        // the value for other components which will be created with the
        // internal value
        store.current = value;

        // now we have to send the next value which will cause the
        // subscriber to update, which will increment the state iter, and
        // cause a new render with updated data.
        store.subject.next(value);

    };

    const storeProvider = () => store.current;

    const mutator = mutatorFactory(storeProvider, setStore);

    const componentCallbacksFactory = () => callbacksFactory(storeProvider, setStore, mutator);

    return [store, mutator, componentCallbacksFactory];

}

export function createObservableStore<V, M, C>(opts: ObservableStoreOpts<V, M, C>): ObservableStoreTuple<V, M, C> {

    const [store, mutator, componentCallbacksFactory] = createInitialContextValues(opts);

    const [storeContext,] = createObservableStoreContext<V>(store);

    const useStoreHook = <K extends keyof V>(keys: ReadonlyArray<K> | undefined) => {
        return useObservableStore(storeContext, keys);
    }

    const callbacksContext = React.createContext<ComponentCallbacksFactory<C>>(componentCallbacksFactory);

    // NOTE: the callbacksFactory should be written with EXACTLY the same
    // semantics as a react hook since it's called directly including useMemo
    // and useCallbacks
    const useCallbacksHook = componentCallbacksFactory;

    const mutatorContext = React.createContext<M>(mutator);

    const useMutatorHook: UseContextHook<M> = () => {
        return React.useContext(mutatorContext);
    }

    const providerComponent = (props: ObservableStoreProps<V>) => {

        // const [store, mutator, componentCallbacksFactory]
        //     = useMemo(() => createInitialContextValues(opts), []);

        return (
            <storeContext.Provider value={store}>
                <callbacksContext.Provider value={componentCallbacksFactory}>
                    <mutatorContext.Provider value={mutator}>
                        {props.children}
                    </mutatorContext.Provider>
                </callbacksContext.Provider>
            </storeContext.Provider>

        )

    }

    return [providerComponent, useStoreHook, useCallbacksHook, useMutatorHook];

}


