import {assert} from 'chai';
import {TestingTime} from '../../../../web/js/test/TestingTime';
import {SplashEventHandlers} from './SplashEngine';
import {SplashEngine} from './SplashEngine';
import {MutableUserFacts} from './SplashEngine';
import {MockStorageBackend} from '../../../../web/js/util/LocalPrefs';
import {StorageBackends} from '../../../../web/js/util/LocalPrefs';
import {LifecycleToggle} from '../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../web/js/ui/util/LifecycleEvents';
import {assertJSON} from '../../../../web/js/test/Assertions';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {Duration} from 'polar-shared/src/util/TimeDurations';

describe('SplashEngine', function() {

    beforeEach(function() {
        StorageBackends.delegate = new MockStorageBackend();
        TestingTime.freeze();
    });

    afterEach(function() {
        StorageBackends.delegate = undefined;
        TestingTime.unfreeze();
    });

    it('Scan forward in the future with default configuration', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {

            datastoreCreated: "2012-02-02T11:38:49.321Z",

            version: "1.0.0",

        };

        const [createSnapshot, eventHandlers] = createEventHandlers();

        const engine = new SplashEngine(facts, eventHandlers);

        testEngineInTheFuture(engine);

        assertJSON(createSnapshot(), {
            "netPromoterCalled": 9,
            "suggestionsCalled": 9,
            "whatsNewCalled": 0
        });

        console.log("worked!");

    });

    it('first NPS, then version upgrade', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {

            datastoreCreated: "2012-02-02T11:38:49.321Z",

            version: "1.0.0",

        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;
        let suggestionsCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };

        const engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 1);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 1);

        TestingTime.forward('8d');

        engine.run();
        assert.equal(whatsNewCalled, 0);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 2);

        TestingTime.forward('1d');
        TestingTime.forward('1m');

        engine.run();
        assert.equal(whatsNewCalled, 0);
        assert.equal(suggestionsCalled, 1);
        assert.equal(netPromoterCalled, 2);

        console.log("worked!");

    });

    it('version upgrade with persisted external state', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;
        let suggestionsCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };

        let engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 1);

        const externalEngineState = engine.toExternalEngineState();

        facts.version = "1.1.0";

        engine = new SplashEngine(facts, eventHandlers, externalEngineState);

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 1);

    });

    it('NPS preempted due to "whats new"', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;
        let suggestionsCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };

        let engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 1);

        const externalEngineState = engine.toExternalEngineState();
        facts.version = "1.1.0";
        TestingTime.forward('10d');

        engine = new SplashEngine(facts, eventHandlers, externalEngineState);

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 1);

        TestingTime.forward('16m');

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(suggestionsCalled, 0);
        assert.equal(netPromoterCalled, 2);

    });

});

/**
 * Keep testing by in the future by running the engine over and over and see
 * how many times we fire and WHAT we fire.
 */
function testEngineInTheFuture(engine: SplashEngine, duration: Duration = '60d') {

    const epoch = new Date();

    while (true) {

        TestingTime.forward('15m');
        engine.run();

        if (TimeDurations.hasElapsed(epoch, duration)) {
            break;
        }

    }

}

export type CreateSnapshotFunction = () => any;

function createEventHandlers(): [CreateSnapshotFunction, SplashEventHandlers] {

    let whatsNewCalled: number = 0;
    let netPromoterCalled: number = 0;
    let suggestionsCalled: number = 0;

    const eventHandlers: SplashEventHandlers = {
        onWhatsNew: () => ++whatsNewCalled,
        onNetPromoter: () => ++netPromoterCalled,
        onSuggestions: () => ++suggestionsCalled,
    };

    const createSnapshot = () => {
        return {
            whatsNewCalled,
            netPromoterCalled,
            suggestionsCalled
        };
    };

    return [createSnapshot, eventHandlers];

}
