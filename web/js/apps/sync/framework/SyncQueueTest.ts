import {assert} from 'chai';
import {SyncQueue} from './SyncQueue';
import {Abortable} from './Abortable';
import {SyncProgressListener} from './SyncProgressListener';
import {Optional} from 'polar-shared/src/util/ts/Optional';


describe('SyncQueueTest', function() {

    const abortable: Abortable = {
        aborted: false
    };

    const syncProgressListener: SyncProgressListener = syncProgress => {
        console.log(syncProgress);
    };

    const syncQueue = new SyncQueue(abortable, syncProgressListener);

    it("basic test", async function () {

        const results: number[] = [];

        syncQueue.add(async() => {
            results.push(0);
            return Optional.empty();
        });

        await syncQueue.execute();

        assert.deepEqual(results, [0]);

    });


    it("with one level of generators", async function () {

        const results: number[] = [];

        syncQueue.add(async () => {
            results.push(0);

            syncQueue.add(async () => {
                results.push(1);
                return Optional.empty();
            });

            return Optional.empty();

        });

        await syncQueue.execute();

        assert.deepEqual(results, [0, 1]);

    });


});
