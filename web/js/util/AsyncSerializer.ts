/**
 * Creates a serializer that makes sure that only ONE operation can happen at
 * once.
 */
import {ArrayQueue} from './ArrayQueue';
import {Latch} from "polar-shared/src/util/Latch";

/**
 * Async serialization is still important as N operations could be in flight and
 * might mutate an object.  If we enqueue all at once and their order is
 * important we're not guaranteed that the last one will win.  The first one
 * could block for a bit, then the second one completes, then the first one
 * is applied and we would end up with invalid data.
 */
export class AsyncSerializer {

    private blockers = new ArrayQueue<Latch<boolean>>();

    public async execute<T>(callable: () => Promise<T>): Promise<T> {

        const myBlocker = new Latch<boolean>();

        try {

            const blocker = this.blockers.peek();

            if (blocker) {
                // make sure that the previous blocker has already completed so
                // we can't perform parallel.
                await blocker.get();
            }

            // we're ready to execute so push our blocker to the queue.
            this.blockers.push(myBlocker);

            return await callable();

        } finally {
            myBlocker.resolve(true);
            this.blockers.delete(myBlocker);
        }

    }

}
