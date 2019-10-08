import {EventHandlers} from './rules_engine/Engine';
import {EventMap} from './rules_engine/Engine';
import {EventMaps} from './rules_engine/Engine';
import {RuleMap} from './rules_engine/Engine';
import {Engine, Event} from './rules_engine/Engine';
import {ExternalEngineState} from './rules_engine/Engine';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Rule} from './rules_engine/Rule';
import {RuleFactPair} from './rules_engine/Rule';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {DurationStr} from 'polar-shared/src/util/TimeDurations';
import {Duration} from 'polar-shared/src/util/TimeDurations';
import {LifecycleEvents} from '../../../../web/js/ui/util/LifecycleEvents';
import {LifecycleToggle} from '../../../../web/js/ui/util/LifecycleToggle';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';

export class SplashEngine {

    private engine: Engine<UserFacts, SplashEventHandlers>;

    constructor(private facts: UserFacts,
                private eventHandlers: SplashEventHandlers,
                private readonly externalEngineState?: ExternalEngineState<UserFacts, SplashEventHandlers>) {

        const rules: RuleMap<UserFacts, SplashEventHandlers> = {
            whatsNew: new WhatsNewRule(),
            netPromoter: new NetPromoterRule(),
            suggestions: new SuggestionsRule(),
        };

        this.engine = new Engine(facts, rules, eventHandlers, externalEngineState);

    }

    public run() {
        this.engine.run();
    }

    public toExternalEngineState() {
        return this.engine.toExternalEngineState();
    }

}

/**
 * Splash engine that automatically persists and resumes from local storage.
 */
export class DefaultSplashEngine extends SplashEngine {

    constructor(facts: UserFacts,
                eventHandlers: SplashEventHandlers) {

        super(facts, eventHandlers, LocalStorageExternalState.get());

    }

    public run() {

        super.run();

        const externalState = this.toExternalEngineState();
        LocalStorageExternalState.set(externalState);

    }

}

class LocalStorageExternalState {

    private static KEY = 'splash-engine-state';

    public static get(): ExternalEngineState<UserFacts, SplashEventHandlers> | undefined {
        const value = localStorage.getItem(this.KEY);

        if (value) {
            return JSON.parse(value);
        } else {
            return undefined;
        }

    }

    public static set(state: ExternalEngineState<UserFacts, SplashEventHandlers>) {
        localStorage.setItem(this.KEY, JSON.stringify(state));
    }

}

export interface SplashEventHandlers extends EventHandlers {
    readonly onWhatsNew: () => void;
    readonly onNetPromoter: () => void;
    readonly onSuggestions: () => void;
}

export interface MutableUserFacts {

    /**
     * The time the datastore was created.
     */
    datastoreCreated: ISODateTimeString;

    /**
     * The currently running version.
     */
    version: string;

}

export interface UserFacts extends Readonly<MutableUserFacts> {

}

interface SuggestionsState {

}

class SuggestionsRule implements Rule<UserFacts, SplashEventHandlers, SuggestionsState> {

    public run(facts: Readonly<UserFacts>,
               eventMap: EventMap<SplashEventHandlers>,
               state?: Readonly<SuggestionsState>): RuleFactPair<UserFacts, SuggestionsState> {

        if (! state) {
            state = {};
        }

        const canShow =
            () => canFireMajorRule(facts, eventMap, eventMap.onSuggestions, 'splash-suggestions-skipped');

        if (canShow()) {
            eventMap.onSuggestions.handler();
        }

        return [facts, state];

    }

}


interface NetPromoterState {
}

class NetPromoterRule implements Rule<UserFacts, SplashEventHandlers, NetPromoterState> {

    public run(facts: Readonly<UserFacts>,
               eventMap: EventMap<SplashEventHandlers>,
               state?: Readonly<NetPromoterState>): RuleFactPair<UserFacts, NetPromoterState> {

        if (! state) {
            state = {};
        }

        const canShow =
            () => canFireMajorRule(facts, eventMap, eventMap.onNetPromoter, 'splash-nps-skipped');

        if (canShow()) {
            eventMap.onNetPromoter.handler();
        }

        return [facts, state];

    }

}


interface WhatsNewState {

    version: string;

}

class WhatsNewRule implements Rule<UserFacts, SplashEventHandlers, WhatsNewState> {

    public run(facts: Readonly<UserFacts>,
               eventMap: EventMap<SplashEventHandlers>,
               state?: Readonly<WhatsNewState>): RuleFactPair<UserFacts, WhatsNewState> {

        const updated = state && state.version !== facts.version;

        if (updated) {
            eventMap.onWhatsNew.handler();
        }

        state = {version: facts.version};

        return [facts, state];

    }

}


/**
 *
 * Determines if we can fire a major rule.
 *
 *  - 3 days since the datastore has been created (aged)
 *  - 15 minutes since ANY rule fired
 *  - 7 days since this rule last fired.
 *
 * @param facts The facts to work with
 * @param eventMap The events to look at their last firing times.
 * @param event The event handler for this rule.
 * @param analyticsKey The key we use to fire analytics for tracking.
 */
function canFireMajorRule(facts: Readonly<UserFacts>,
                          eventMap: EventMap<SplashEventHandlers>,
                          event: Event,
                          analyticsKey: string) {

    // Prompt for suggestion if the user has been using polar for at LEAST three
    // days and we are at least 15m from the last event.

    const hasExistingAgedDatastore = () => {
        return UserFactsUtils.hasExistingAgedDatastore(facts, '3d');
    };

    const hasMinimumTimeSinceLastEvent = () => {
        const lastEventExecution = EventMaps.latestExecution(eventMap);
        return hasMinimumTimeSince(lastEventExecution, '15m');
    };

    const hasMinimumTimeSinceLastRuleFired = () => {
        const epoch = event.lastExecuted;
        return hasMinimumTimeSince(epoch, '7d');
    };

    if (! hasExistingAgedDatastore()) {
        RendererAnalytics.event({category: analyticsKey, action: 'reason-has-existing-aged-datastore'});
        return false;
    }

    if (! hasMinimumTimeSinceLastMajorPrompt(eventMap)) {
        RendererAnalytics.event({category: analyticsKey, action: 'reason-has-minimum-time-since-last-major-prompt'});
        return false;
    }

    if (! hasMinimumTimeSinceLastEvent()) {
        RendererAnalytics.event({category: analyticsKey, action: 'reason-has-minimum-time-since-last-event'});
        return false;
    }
    if (! hasMinimumTimeSinceLastRuleFired()) {
        RendererAnalytics.event({category: analyticsKey, action: 'reason-has-minimum-time-since-last-rule-fired'});
        return false;
    }

    if (! hasTourTerminated()) {
        RendererAnalytics.event({category: analyticsKey, action: 'reason-has-tour-terminated'});
        return false;
    }

    return true;

}

function hasMinimumTimeSinceLastMajorPrompt(eventMap: EventMap<SplashEventHandlers>) {

    const events = [eventMap.onNetPromoter, eventMap.onSuggestions];

    for (const event of events) {
        if (! hasMinimumTimeSince(event.lastExecuted, '1d')) {
            return false;
        }
    }

    return true;

}

function hasMinimumTimeSince(epoch: ISODateTimeString | undefined,
                             duration: DurationStr,
                             defaultValue: boolean = true) {

    if (epoch) {

        const since = ISODateTimeStrings.parse(epoch);
        return TimeDurations.hasElapsed(since, duration);

    } else {
        // our epoch hasn't happened yet so it's ok to send out this message.
        return defaultValue;
    }

}

function hasTourTerminated() {
    // TODO: I think this should be a fact and we should not measure
    // it directly.
    return LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);
}

class UserFactsUtils {

    public static hasExistingAgedDatastore(facts: UserFacts, duration: Duration) {

        // datastore should be created for at least 7 days.

        if (facts.datastoreCreated) {

            const since = ISODateTimeStrings.parse(facts.datastoreCreated);

            if (TimeDurations.hasElapsed(since, duration)) {
                return true;
            }

        }

        return false;

    }

}
