import {INamedWebRequestEvent} from './WebRequestReactor';
import {Logger} from 'polar-shared/src/logger/Logger';
import {BaseWebRequestsListener} from './BaseWebRequestsListener';

const log = Logger.create();

/**
 * A simple debug web requests listener which just traces the output so that we
 * can better understand the event flow.
 *
 * Main API documentation is here:
 *
 * https://electronjs.org/docs/api/web-request
 *
 */
export class DebugWebRequestsListener extends BaseWebRequestsListener {

    /**
     * The number of pending requests
     */
    private pending = 0;

    /**
     */
    constructor() {

        super();

    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    public onWebRequestEvent(event: INamedWebRequestEvent) {

        const {name, details, callback} = event;

        if (name === "onCompleted" || name === "onErrorOccurred") {
            // this request has already completed so is not considered against
            // pending any longer
            --this.pending;
        }

        log.info(`${name} (pending=${this.pending}): `, JSON.stringify(details, null, "  "));

        if (name === "onBeforeRequest") {
            // after this request the pending will be incremented.
            ++this.pending;
        }

        if (callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

}
