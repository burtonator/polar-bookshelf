import React from 'react';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import {
    OnErrorCallback,
    OnNextCallback,
    SnapshotSubscriberWithID,
    SnapshotUnsubscriber,
    SnapshotSubscriber,
    SnapshotTuple
} from 'polar-shared/src/util/Snapshots';
import {IDStr} from "polar-shared/src/util/Strings";
import {isPresent} from "polar-shared/src/Preconditions";

export interface SubscriptionValue<T> {
    readonly value: T | undefined;
    readonly error: Error | undefined;
}

export function useSnapshotSubscriberUsingCallbacks<T>(subscriber: SnapshotSubscriberWithID<T>,
                                                       onNext: OnNextCallback<T>,
                                                       onError?: OnErrorCallback) {

    const subscriberIDRef = React.useRef<IDStr>(subscriber.id);
    const unsubscriberRef = React.useRef<SnapshotUnsubscriber | undefined>(undefined);

    if (unsubscriberRef.current && subscriberIDRef.current !== subscriber.id) {
        // we've been called again but there's an existing unsubscriber so
        // we have to unsubscribe, then resubscribe.

        unsubscriberRef.current();
        unsubscriberRef.current = undefined;

    }

    if (! unsubscriberRef.current) {

        const unsubscriber = subscriber.subscribe(onNext, onError);

        if ( ! isPresent(unsubscriber)) {
            console.warn("No unsubscriber");
        }

        unsubscriberRef.current = unsubscriber;

    }

    useComponentWillUnmount(() => {

        if (unsubscriberRef.current) {
            // we're unmounting and we need to unsubscribe to snapshots
            unsubscriberRef.current();
        }

    })

}


// TODO: I don't know if I like this because the subscription returns undefined
// if the remote value is removed but we don't have a dedicated type so we're
// unable to determine if the value was DELETED or just pending a read.
/**
 * @NotStale I might end up using this in the future.
 */
export function useSnapshotSubscriber<T>(subscriber: SnapshotSubscriberWithID<T>): SubscriptionValue<T> {

    const [state, setState] = React.useState<SubscriptionValue<T>>({
        value: undefined,
        error: undefined
    });

    function onNext(value: T | undefined) {
        setState({value, error: undefined});
    }

    function onError(error: Error) {
        setState({value: undefined, error});
    }

    useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError);

    return state;

}

export function useSnapshots<T>(subscriber: SnapshotSubscriber<T>): SnapshotTuple<T> {

    const [state, setState] = React.useState<SnapshotTuple<T>>([undefined, undefined]);

    const unsubscriberRef = React.useRef<SnapshotUnsubscriber | undefined>(undefined);

    function onNext(value: T | undefined) {
        setState([value, undefined]);
    }

    function onError(error: Error) {
        setState([undefined, error]);
    }

    useComponentDidMount(() => {
        unsubscriberRef.current = subscriber(onNext, onError);
    });

    useComponentWillUnmount(() => {

        if (unsubscriberRef.current) {
            // we're unmounting and we need to unsubscribe to snapshots
            unsubscriberRef.current();
        }

    })

    return state;

}
