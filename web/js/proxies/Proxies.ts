/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 *
 * Note that Object.observe and other changes were apparently never ratified
 * so we have to use Proxy objects to implement this functionality.
 */
import {TraceListeners} from "./TraceListeners";
import {Objects} from "../util/Objects";
import {TraceHandler} from "./TraceHandler";
import {ObjectPaths} from "./ObjectPaths";
import {Paths} from "polar-shared/src/util/Paths";
import {TraceListener, TraceListenerFunction} from './TraceListener';
import {TraceEvent} from './TraceEvent';

/**
 * A sequence identifier generator so that we can assign objects a unique value
 * while we're enumerating them.
 */
let sequence = 0;

export class Proxies {

    /**
     * Deeply trace the given object and call back on the traceListener every
     * time we notice a mutation.  The trace listener receives the following
     * arguments:
     */
    public static create<T>(target: T,
                            traceListeners?: TraceListener | TraceListenerFunction | ReadonlyArray<TraceListener>,
                            opts?: any): T {

        if (typeof target !== "object") {
            throw new Error("Only works on objects: " + typeof target);
        }

        opts = Objects.defaults(opts, {
            pathPrefix: ""
        });

        if (!traceListeners) {
            traceListeners = [];
        }

        const traceListenersArray = TraceListeners.asArray(traceListeners);

        const objectPathEntries = ObjectPaths.recurse(target);

        let root: any;

        objectPathEntries.forEach((objectPathEntry) => {

            let path = objectPathEntry.path;

            if (opts.pathPrefix && opts.pathPrefix !== "") {
                path = Paths.create(opts.pathPrefix, objectPathEntry.path);
            }

            const proxy = Proxies.trace(path, objectPathEntry.value, traceListenersArray);

            // replace the object key in the parent with a new object that is
            // traced.
            if (objectPathEntry.parent != null) {
                objectPathEntry.parent[objectPathEntry.parentKey!] = proxy;
            } else {
                root = proxy;
            }

        });

        return root;

    }

    public static trace(path: string, value: any, traceListeners: any) {

        if (typeof value !== "object") {
            throw new Error("We can only trace object types.");
        }

        traceListeners = TraceListeners.asArray(traceListeners);

        if (Object.isFrozen(value)) {

            // Do not handle frozen objects but might have to in the future for
            // the initial value.

            // TODO: it's probably best to throw an error here because we've
            // been asked to trace but we're not tracing.  This is an API flaw.

            return value;

        }

        const traceIdentifier = sequence++;

        // for this to work, I need to keep track of ALL TraceHandlers in the
        // object itself by possibly having a __traceHandlers or some other
        // strategy or __paths and then dispatch that way...

        const traceHandler = new TraceHandler(path, traceListeners, value, traceIdentifier, Proxies);

        // TODO: could I store these in the TraceHandler and not in the value?
        //
        // since we have one TraceHandler per path this might work but I would
        // need to figure out how to get the right value from the TraceHandler.
        // I think I can do this by custom handling the get() Proxy and then
        // returning __traceIdentifier or __traceListeners based on the caller.

        const privateMembers = [

            // the __traceIdentifier is a unique key for the object which we
            // use
            // to identify which one is being traced.  This way we essentially
            // have a pointer we can use to work with the object directly.
            //
            // { name: "__traceIdentifier", value: traceIdentifier },
            //
            // // keep the traceListener registered with the object so that I
            // can // verify that the object we're working with is actually
            // being used // with the same trace and not being re-traced by
            // something else.  { name: "__traceListeners", value:
            // traceListeners },

            // keep the path to this object for debug purposes.
            // { name: "__path", value: path }

        ];

        // privateMembers.forEach(privateMember => {
        //
        //     if(! (privateMember.name in value)) {
        //
        //         // the __traceIdentifier is a unique key for the object
        // which we use // to identify which one is being traced.  This way we
        // essentially // have a pointer we can use to work with the object
        // directly.  Object.defineProperty(value, privateMember.name, { value:
        // privateMember.value, enumerable: false, writable: false });  }  });

        // TODO: do this in the TraceHandler get method?

        if (value.addTraceListener) {
            value.addTraceListener(traceListeners);
        } else {
            Object.defineProperty(value, "addTraceListener", {
                value: traceHandler.addTraceListener.bind(traceHandler),
                enumerable: false,
                writable: false
            });
        }

        return new Proxy(value, traceHandler);

    }

}


