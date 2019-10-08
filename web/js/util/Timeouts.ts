/**
 * Class that works around some insanity with the nodejs setTimeout API.
 */
import {DOM} from './DOM';

export class Timeouts {

    public static setTimeout(handler: () => void, timeout: number): Timeout {

        if (typeof window !== 'undefined' && window && window.setTimeout) {
            const id = window.setTimeout(handler, timeout);
            return new DOMTimeout(id);
        }

        // the NodeJS version
        const id = setTimeout(handler, timeout);
        return new NodeTimeout(id);

    }

}

export interface Timeout {

    /**
     * Clear this timeout so that it does not run.
     */
    clear(): void;

}

class DOMTimeout implements Timeout {

    constructor(private readonly id: number) {

    }

    public clear(): void {
        window.clearTimeout(this.id);
    }

}

class NodeTimeout implements Timeout {

    constructor(private readonly id: any) {

    }

    public clear(): void {
        clearTimeout(this.id);
    }

}
