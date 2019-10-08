import {AsyncWorkQueue, TypedAsyncFunction} from './AsyncWorkQueue';

export class AsyncWorkQueues {

    /**
     * Await a list of async functions which return promises. Note that we
     * DO NOT wait on promises directly.  We have to be given functions that
     * return promises. Promises MAY start before they are actually awaited.
     *
     */
    public static async awaitAsyncFunctions<T>(typedAsyncFunctions: ReadonlyArray<TypedAsyncFunction<T>>,
                                               concurrency: number = 25): Promise<ReadonlyArray<T>> {

        const results: T[] = [];

        const work = typedAsyncFunctions.map(current => async () => {
            const value = await current();
            results.push(value);
        });


        const asyncWorkQueue = new AsyncWorkQueue(work, concurrency);

        await asyncWorkQueue.execute();

        return results;

    }

}
