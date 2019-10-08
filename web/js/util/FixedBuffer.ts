/**
 * Fixed capacity buffer view of the underlying data.
 */
import {SimpleReactor} from '../reactor/SimpleReactor';
import {EventListener, Releaseable} from '../reactor/EventListener';

export class FixedBuffer<V> {

    public readonly buffer: V[] = [];

    private readonly capacity: number;

    private readonly reactor = new SimpleReactor<V>();

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public write(value: V): void {

        if (this.buffer.length >= this.capacity) {
            this.buffer.splice(0, 1);
        }

        this.buffer.push(value);

        this.reactor.dispatchEvent(value);

    }

    public clear(): void {
        this.buffer.splice(0, this.buffer.length);
    }

    public toView(): ReadonlyArray<V> {
        return this.buffer;
    }

    public addEventListener(eventListener: EventListener<V>): Releaseable {
        return this.reactor.addEventListener(eventListener);
    }

}
