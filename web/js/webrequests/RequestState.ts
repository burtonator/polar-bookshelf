import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

/**
 * Keep an index of the requests that are executing so that we can detect
 * problems with pending URLs.
 */
export class RequestState {

    private readonly map: {[id: number]: IRequestEntry} = {};

    constructor() {
        log.info("Tracking request state...");
    }

    // check for double started and double finished too..

    public markStarted(id: number, url: string, eventName: string) {

        const requestEntry: IRequestEntry = {id, url, state: 'STARTED', eventName};

        if (id in this.map) {
            const existing = this.map[id];
            log.warn(`Request was started but already present in map for event: ${existing.eventName}`, existing);
            return;
        }

        this.map[id] = requestEntry;

    }

    public markFinished(id: number, url: string, eventName: string) {

        const requestEntry: IRequestEntry = {id, url, state: 'FINISHED', eventName};

        if (! (id in this.map)) {
            log.warn("Request was marked finished but never marked started.");
            return;
        }

        if (this.map[id].state !== 'STARTED') {
            const existing = this.map[id];
            log.warn(`Request was marked finished but is not currently started: `, existing);
            return;
        }

        this.map[id] = requestEntry;

    }

}

/**
 * Represents a request stored in the backing map.
 */
export interface IRequestEntry {

    readonly id: number;
    readonly url: string;
    readonly state: 'STARTED' | 'FINISHED';
    readonly eventName: string;

}
