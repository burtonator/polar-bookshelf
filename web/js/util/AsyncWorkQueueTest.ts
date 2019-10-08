import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import waitForExpect from 'wait-for-expect';
import {AsyncFunction, AsyncWorkQueue} from './AsyncWorkQueue';
import {Latch} from "polar-shared/src/util/Latch";

interface Widget {

}

let mockValue: number = 0;

export async function mockAsyncFunction() {
    return mockValue++;
}

describe('AsyncWorkQueue', function() {

    let inputs: AsyncFunction[] = [];

    beforeEach(function() {
        mockValue = 0;
        inputs = [];
    });


    it("Chained work", async function() {

        const work: AsyncFunction[] = [];

        async function firstJob() {
            return 1;
        }

        async function secondJob() {
            return 2;
        }

        work.push(mockAsyncFunction);

        const asyncWorkQueue = new AsyncWorkQueue(work);
        await asyncWorkQueue.execute();

        assertJSON(inputs.sort(), []);

    });


    it("With no work", async function() {

        const work: AsyncFunction[] = [];

        const asyncWorkQueue = new AsyncWorkQueue(work);
        await asyncWorkQueue.execute();

        assertJSON(inputs.sort(), []);

    });

    it("With work smaller than concurrency.", async function() {
        const work: AsyncFunction[] = [mockAsyncFunction, mockAsyncFunction];
        const asyncWorkQueue = new AsyncWorkQueue(work, 10);
        await asyncWorkQueue.execute();
        assertJSON(work.sort(), []);
    });

    it("With work larger than concurrency.", async function() {
        const work: AsyncFunction[] = [mockAsyncFunction, mockAsyncFunction, mockAsyncFunction];
        const asyncWorkQueue = new AsyncWorkQueue(work, 2);
        await asyncWorkQueue.execute();
        assertJSON(work.sort(), []);
    });


    it("Expand with additional work", async function() {

        // test that we can add more work once we've started...

        const work: AsyncFunction[] = [];

        async function addMoreWork() {
            work.push(mockAsyncFunction);
        }

        work.push(mockAsyncFunction);
        work.push(addMoreWork);

        const asyncWorkQueue = new AsyncWorkQueue(work);
        await asyncWorkQueue.execute();
        assertJSON(work.sort(), []);

        assert.equal(asyncWorkQueue.getCompleted(), 3);

    });

    it("Verify that 'executing' lowers", async function() {

        const latches: Array<Latch<boolean>> = [];

        latches.push(new Latch());
        latches.push(new Latch());

        let concurrency = 0;

        async function verifyConcurrency() {
            const latch = latches[concurrency++];
            await latch.get();
            return true;
        }

        const work = [verifyConcurrency, verifyConcurrency];

        const asyncWorkQueue = new AsyncWorkQueue(work, 2);
        const executionPromise = asyncWorkQueue.execute();

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getExecuting(), 2);
        });

        // resolve the first latch...

        latches[0].resolve(true);

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getExecuting(), 1);
        });

        latches[1].resolve(true);

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getExecuting(), 0);
        });

        await executionPromise;

    });


    it("Verify that 'executing' increases when the work expands", async function() {

        const latches: Array<Latch<boolean>> = [];

        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());

        let completedTasks = 0;

        async function verifyConcurrency() {
            const latch = latches[completedTasks++];
            await latch.get();
            return true;
        }

        async function addMoreWork() {
            const latch = latches[completedTasks++];
            await latch.get();
            work.push(verifyConcurrency);
            work.push(verifyConcurrency);
        }

        const work = [verifyConcurrency, verifyConcurrency, addMoreWork];

        const asyncWorkQueue = new AsyncWorkQueue(work, 2);
        const executionPromise = asyncWorkQueue.execute();

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getExecuting(), 2);
        });

        // resolve the first two latches ...

        latches[0].resolve(true);
        latches[1].resolve(true);

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getCompleted(), 2);
            assert.equal(asyncWorkQueue.getExecuting(), 1);
        });


        latches[2].resolve(true);

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getCompleted(), 3);
            assert.equal(asyncWorkQueue.getExecuting(), 2);
        });

        latches[3].resolve(true);
        latches[4].resolve(true);

        await waitForExpect(async () => {
            assert.equal(asyncWorkQueue.getCompleted(), 5);
            assert.equal(asyncWorkQueue.getExecuting(), 0);
        });

        await executionPromise;

    });


    it("With verified concurrency", async function() {

        const latches: Array<Latch<boolean>> = [];

        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());

        let concurrency = 0;

        async function verifyConcurrency() {
            const latch = latches[concurrency++];
            await latch.get();
            return true;
        }

        const work = [verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency,
                      verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency];

        const asyncWorkQueue = new AsyncWorkQueue(work, 10);
        const executionPromise = asyncWorkQueue.execute();

        await waitForExpect(async () => {
            assert.equal(concurrency, 10);
            assert.equal(asyncWorkQueue.getExecuting(), 10);
        });

        for (const latch of latches) {
            latch.resolve(true);
        }

        await executionPromise;

    });

});

