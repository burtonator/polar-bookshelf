import {assert} from 'chai';
import {Engine} from './Engine';
import {EventMaps} from './Engine';
import {EventHandlers} from './Engine';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {isPresent} from 'polar-shared/src/Preconditions';
import {TestingTime} from '../../../../../web/js/test/TestingTime';
import {assertJSON} from '../../../../../web/js/test/Assertions';

describe('Engine', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    describe('EventHandlers', function() {

        it('basic', function() {

            const myEventHandlers = {
                onFoo: NULL_FUNCTION
            };

            const myEventMap = EventMaps.create(myEventHandlers, {});

            assert.isTrue(isPresent(myEventMap.onFoo));
            assert.isTrue(isPresent(myEventMap.onFoo.handler));
            assert.isTrue(myEventMap.onFoo.lastExecuted === undefined);
            myEventMap.onFoo.handler();
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);

            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");

        });


        it('withExistingTime', function() {

            const myEventHandlers = {
                onFoo: NULL_FUNCTION
            };

            const myEventMap = EventMaps.create(myEventHandlers, {onFoo: "2012-03-01T00:00:00.000Z"});

            assert.isTrue(isPresent(myEventMap.onFoo));
            assert.isTrue(isPresent(myEventMap.onFoo.handler));
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-01T00:00:00.000Z");
            myEventMap.onFoo.handler();
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");

            assertJSON(EventMaps.toEventTimes(myEventMap), {
                "onFoo": "2012-03-02T11:38:49.321Z"
            });


        });

    });

});
