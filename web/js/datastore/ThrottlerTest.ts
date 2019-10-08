import {assert} from 'chai';
import {Throttler} from './Throttler';
import {Promises} from '../util/Promises';
import {Latch} from "polar-shared/src/util/Latch";

describe('Throttler', function() {

    describe('by maxRequests', function() {

        it("basic with one request throttled", async function() {

            let resolved: boolean = false;

            const throttler = new Throttler(() => resolved = true,
                                            {maxRequests: 1, maxTimeout: 99999999} );

            assert.equal(resolved, false);

            throttler.exec();
            assert.equal(resolved, false);
            throttler.exec();
            assert.equal(resolved, true);

        });

        it("no requests throttled", async function() {

            let resolved: boolean = false;

            const throttler = new Throttler(() => resolved = true,
                                            {maxRequests: 0, maxTimeout: 99999999} );

            assert.equal(resolved, false);

            throttler.exec();
            assert.equal(resolved, true);

        });


        it("two requests throttled", async function() {

            let resolved: boolean = false;

            const throttler = new Throttler(() => resolved = true,
                                            {maxRequests: 2, maxTimeout: 99999999} );

            assert.equal(resolved, false);

            throttler.exec();
            assert.equal(resolved, false);
            throttler.exec();
            assert.equal(resolved, false);
            throttler.exec();
            assert.equal(resolved, true);

        });

    });

    describe('by time', function() {

        it("basic with one request throttled", async function() {

            let resolved: number = 0;

            const throttler = new Throttler(() => ++resolved,
                                            {maxRequests: 9999, maxTimeout: 1000} );

            assert.equal(resolved, 0);

            throttler.exec();
            assert.equal(resolved, 0);

            // now try to exec a bunch of times to make sure we only are
            // **actually** executed once.
            throttler.exec();
            throttler.exec();
            throttler.exec();
            throttler.exec();
            throttler.exec();
            throttler.exec();
            throttler.exec();

            await Promises.waitFor(1010);

            assert.equal(resolved, 1);

        });

    });

});


