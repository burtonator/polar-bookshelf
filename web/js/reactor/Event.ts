
// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

import {EventListener} from './EventListener';

export class Event<V> {

    public readonly name: string;

    private readonly listeners: Array<EventListener<V>> = [];

    constructor(name: string) {
        this.name = name;
    }

    public registerListener(listener: EventListener<V>) {
        this.listeners.push(listener);
    }

    public getListeners() {
        return this.listeners;
    }

    public hasListeners() {
        return this.listeners.length > 0;
    }

    public removeListener(listener: EventListener<V>): boolean {

        const index = this.listeners.indexOf(listener);

        if (index > -1) {
            this.listeners.splice(index, 1);
            return true;
        }

        return false;

    }

    public size() {
        return this.listeners.length;
    }

}
