import {TraceListener, TraceListenerFunction} from './TraceListener';

export class TraceListeners {

    /**
     * Convert this to an array so that we're always working with an array.
     *
     */
    public static asArray(input: TraceListener | TraceListenerFunction | ReadonlyArray<TraceListener>):
        ReadonlyArray<TraceListener | TraceListenerFunction> {

        if (! input) {
            return [];
        }

        if (! Array.isArray(input)) {
            return <ReadonlyArray<TraceListener | TraceListenerFunction>> [input];
        }

        return input;

    }

}
