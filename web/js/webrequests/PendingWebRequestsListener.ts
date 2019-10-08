import {INamedWebRequestEvent, IWebRequestDetails} from './WebRequestReactor';
import {Logger} from 'polar-shared/src/logger/Logger';
import {BaseWebRequestsListener} from './BaseWebRequestsListener';
import {RequestState} from './RequestState';
import {ProgressCalculator} from '../util/ProgressCalculator';

const log = Logger.create();

/**
 * Tracks the number of pending requests.
 *
 */
export class PendingWebRequestsListener extends BaseWebRequestsListener {

    /**
     * The actual events we've seen for tracking purposes.
     */
    private pendingRequests: {[id: number]: any} = {};

    /**
     * Registered event listeners that we would need to dispatch.
     */
    private eventListeners: PendingWebRequestsCallback[] = [];

    /**
     * Keeps track of metadata for each request to help detect errors.
     */
    private requestState = new RequestState();

    private startedRequests: {[id: number]: any} = {};

    private finishedRequests: {[id: number]: any} = {};

    constructor() {

        super();


    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object about the request.
     */
    public onWebRequestEvent(event: INamedWebRequestEvent) {

        setTimeout(() => {

            this.processWebRequestEvent(event);

        }, 0);

    }

    public processWebRequestEvent(event: INamedWebRequestEvent) {

        // console.log(`event data: ${event.name}\t${event.details.id}\t${event.details.url}\t${event.details.resourceType}\t${event.details.webContentsId}`);

        const {name, details, callback} = event;

        // WARNING: this code behaves VERY strangely and we DO NOT receive events
        // in the proper order for some reason.  I would expect to receive them
        // in the logical order detailed here:
        //
        // https://developer.chrome.com/extensions/webRequest
        //
        // but we actually receive them out of order.
        //
        // this means that the pending request count can go to negative until
        // it goes positive. I suspect that they're using some sort of multi-core
        // or unfair queue system that re-orders the events before I see it or
        // this code is executing across multiple threads on multiple cores and
        // the data is being handled balanced across cores which is why we see
        // ordering issues.
        //
        // I've added some logging to the code so we can trace this but it's
        // rather difficult to deal with because a real but could happen
        // around dropped messages but we wouldn't notice that where negative
        // counts could catch it.

        let pendingChange = null;


        // WARN: I don't think increment + decrement work here as I suspect
        // multiple threads are calling us so we're having to keep requests
        // in maps which wastes a bit more memory. I suspect we have one thread
        // per iframe.  Either way using dictionaries avoided a -1 pending
        // count.

        if (name === "onBeforeRequest") {
            // after this request the pending will be incremented.

            this.pendingRequests[details.id] = details;

            this.startedRequests[details.id] = {
                // the event used to mark the request started
                event: name,
                id: details.id,
                url: details.url
            };

            pendingChange = "INCREMENTED";

            this.requestState.markStarted(details.id, details.url, name);

        }


        // NOTE onErrorOccurred is a fail through for many of these I think.
        if (name === "onCompleted" ||
            name === "onErrorOccurred" ||
            name === "onBeforeRedirect" ||
            name === "onAuthRequired") {

            // this request has already completed so is not considered against
            // pending any longer

            delete this.pendingRequests[details.id];

            this.finishedRequests[details.id] = {
                // the name of the event that we used to mark finished.
                event: name,
                id: details.id,
                url: details.url
            };

            pendingChange = "DECREMENTED";

            this.requestState.markFinished(details.id, details.url, name);

        }

        /**
         * The total number of requests that have been started.
         *
         * @type {number}
         */
        const started = Object.keys(this.startedRequests).length;

        /**
         * The total number of finished requests (either completed, or failed)
         *
         * @type {number}
         */
        const finished = Object.keys(this.finishedRequests).length;

        /**
         * The number of pending requests that have not yet finished.
         *
         * @type {number}
         */
        const pending = started - finished;

        if (pendingChange) {
            log.info(`Pending state ${pendingChange} for request id=${details.id} to ${pending} on ${name} for URL: ${details.url}`);
        }

        /**
         * The current progress for the page from 0 to 100.
         *
         * @type {number}
         */
        const progress = ProgressCalculator.calculate(finished, started);

        if (pending < 5) {
            log.debug("The following pending requests remain: \n", this.pendingRequests);
        }

        if (pending < 0) {
            const msg = `Pending request count is negative: ${pending} (started=${started}, finished=${finished})`;
            log.warn(msg);
        }

        // TODO: we removed logging the full details object because the
        // uploadData was just too much content.

        log.debug(`Pending requests on ${name}: `, {
            pending,
            started,
            finished,
            progress
        });

        this.dispatchEventListeners({
            name,
            details,
            pending,
            started,
            finished,
            progress
        });

        if (callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

    /**
     *
     * @param eventListener {Function}
     */
    public addEventListener(eventListener: PendingWebRequestsCallback) {
        this.eventListeners.push(eventListener);
    }

    public dispatchEventListeners(event: PendingWebRequestsEvent) {
        this.eventListeners.forEach(eventListener => {
            eventListener(event);
        });
    }

}

export type PendingWebRequestsCallback = (event: PendingWebRequestsEvent) => void;

export interface PendingWebRequestsEvent {

    readonly name: string;
    readonly details: IWebRequestDetails;
    readonly pending: number;
    readonly started: number;
    readonly finished: number;
    readonly progress: number;

}
