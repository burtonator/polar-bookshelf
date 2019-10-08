import {assert} from 'chai';
import {ProgressCalculator} from './ProgressCalculator';
import {ProgressTrackers} from './ProgressTrackers';
import {ProgressTracker} from './ProgressTracker';


describe('ProgressTracker', function() {

    it("Basic", async function() {

        const progressTracker = new ProgressTracker(1, 'test');
        progressTracker.incr();
        const progress = progressTracker.peek();

        assert.equal(progress.progress, 100);

    });

    it("Basic with irrational numbers", async function() {

        // irrational number can cause problems with progress bars so we need
        // to make sure the floating point component is finite.

        const progressTracker = new ProgressTracker(3, 'test');
        assert.equal(progressTracker.incr().progress, 33.33);
        assert.equal(progressTracker.incr().progress, 66.67);
        assert.equal(progressTracker.incr().progress, 100);

    });

    it("Make sure the last is 100%", async function() {

        const progressTracker = new ProgressTracker(3, 'test');
        progressTracker.incr();
        progressTracker.incr();

        assert.equal(progressTracker.incr().progress, 100);
        assert.equal(progressTracker.peek().progress, 100);

    });

    it("Terminate with no entries", async function() {

        const progressTracker = new ProgressTracker(0, 'test');
        const progress = progressTracker.terminate();
        assert.equal(progress.completed, 0);
        assert.equal(progress.total, 0);
        assert.equal(progress.progress, 100);

    });

    it("Terminate with 1 entry", async function() {

        const progressTracker = new ProgressTracker(1, 'test');
        const progress = progressTracker.terminate();
        assert.equal(progress.completed, 1);
        assert.equal(progress.total, 1);
        assert.equal(progress.progress, 100);

    });

});
