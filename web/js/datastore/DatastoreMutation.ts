import {Latch} from "polar-shared/src/util/Latch";

/**
 * The result of a Datastore mutation including latches for whether the result
 * was full written or not.
 */
export interface DatastoreMutation<T> {

    readonly id: number;

    /**
     * The mutation was written but still pending.  This happens when we're
     * writing to a WAL or a local vs cloud environment where the write may need
     * to be written to a cloud provider.
     */
    readonly written: Latch<T>;

    /**
     * The mutation was fully commmited and can not be lost.
     */
    readonly committed: Latch<T>;

}

abstract class AbstractDatastoreMutation<T> implements DatastoreMutation<T> {

    public static SEQUENCE = 0;

    public readonly id: number = AbstractDatastoreMutation.SEQUENCE++;

    public abstract readonly written: Latch<T>;
    public abstract readonly committed: Latch<T>;

}

/**
 * Fully committed ahead of time and with a given value. This is used for the
 * disk datastore
 */
export class DefaultDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    // TODO: refactor and rename class as DatastoreLatchPair
    constructor() {
        super();
    }

    public readonly written = new Latch<T>();

    public readonly committed = new Latch<T>();

}

/**
 *
 */
export class CommittedDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    public readonly written = new Latch<T>();

    public readonly committed = new Latch<T>();

    constructor(value: T) {
        super();
        this.written.resolve(value);
        this.committed.resolve(value);
    }

}

/**
 * The writes written and committed mutations complete together as a batch.
 */
export class BatchDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    public readonly written: Latch<T>;

    public readonly committed: Latch<T>;

    constructor(dm0: DatastoreMutation<T>, dm1: DatastoreMutation<T>, target: DatastoreMutation<T> ) {
        super();

        this.written = target.written;
        this.committed = target.committed;

        this.batched(dm0.written.get(), dm1.written.get(), this.written);
        this.batched(dm0.committed.get(), dm1.committed.get(), this.committed);

    }

    private batched(promise0: Promise<T>, promise1: Promise<T>, latch: Latch<T>): void {

        const batch = Promise.all([promise0, promise1]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }

}
