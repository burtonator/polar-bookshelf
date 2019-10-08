import {Rule} from './Rule';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from 'polar-shared/src/util/Reducers';


export type EventHandler = () => void;

export interface EventHandlers {
    readonly [name: string]: EventHandler;
}

/**
 * An engine that should run with facts , against rules, which can emit events.
 *
 * The engine can be event based or poll based and is designed to be very
 * efficient to run just from a few variables.
 */
export class Engine<F, H extends EventHandlers> {

    private readonly engineState: MutableEngineState<F, H>;

    private readonly eventMap: MutableEventMap<H>;

    /**
     *
     * @param facts The facts exposed to all rules in the engine.
     * @param rules The rule map we should execute
     * @param eventHandlers The event handlers we should pass to rules.
     * @param externalEngineState Used for resuming engine state.
     */
    constructor(private facts: F,
                private readonly rules: RuleMap<F, H>,
                private readonly eventHandlers: H,
                private readonly externalEngineState?: ExternalEngineState<F, H>) {

        const defaultRuleStates = () => {

            if (externalEngineState) {
                // we have to restore from an external state
                return externalEngineState.ruleStates;
            }

            return {};

        };

        const defaultEventTimes = () => {

            if (externalEngineState) {
                return externalEngineState.eventTimes;
            }

            return {};

        };


        // prepare the default state.
        this.engineState = {
            ruleStates: defaultRuleStates(),
        };

        this.eventMap = EventMaps.create(this.eventHandlers, defaultEventTimes());

    }

    public run() {

        const {engineState, rules, eventMap} = this;

        const ruleNames = Object.getOwnPropertyNames(this.rules);

        for (const ruleName of ruleNames) {

            const rule = rules[ruleName];

            const state = engineState.ruleStates[ruleName];

            const result = rule.run(this.facts, eventMap, state);

            // now update the fact and state of this object
            engineState.ruleStates[ruleName] = result[1];

            this.facts = result[0];

        }

    }

    public toExternalEngineState(): ExternalEngineState<F, H> {

        return {
            ...this.engineState,
            eventTimes: EventMaps.toEventTimes(this.eventMap)
        };

    }

}

export class RuleMap<F, H extends EventHandlers> {

    [name: string]: Rule<F, H, any>;

}

export type RuleKeys<F, H extends EventHandlers> = keyof RuleMap<F, H>;

/**
 * Provide the order of the rules.  This is a bit verbose but Javascript object
 * keys order isn't defined reliably and I want to make sure we never have bugs
 * here.
 */
export type RuleOrder<F, H extends EventHandlers> = [RuleKeys<F, H>];

interface MutableEngineState<F, H extends EventHandlers> {

    /**
     * The states of the individual rules.
     */
    ruleStates: {[id: string]: any};

}

/**
 * The engine state between run which between facts F and handlers H.
 */
export interface ExternalEngineState<F, H extends EventHandlers> extends Readonly<MutableEngineState<F, H>> {

    /**
     *
     */
    readonly eventTimes: Partial<EventTimes<H>>;


}

export type MutableEventTimes<E extends EventHandlers> = {
    [name in keyof E]: ISODateTimeString | undefined;
};

export type EventTimes<E extends EventHandlers> = Readonly<MutableEventTimes<E>>;

export interface MutableEvent {
    handler: EventHandler;
    lastExecuted: ISODateTimeString | undefined;
}

export interface Event extends Readonly<MutableEvent> {

}

export type MutableEventMap<E extends EventHandlers> = {
    [name in keyof E]: Event;
};

export type EventMap<E extends EventHandlers> = Readonly<MutableEventMap<E>>;

export class EventMaps {

    public static create<E extends EventHandlers>(handlers: E,
                                                  eventTimes: Partial<EventTimes<E>>): EventMap<E> {

        const result: MutableEventMap<E> = <any> {};

        for (const handlerName of Object.keys(handlers)) {

            const handler = handlers[handlerName];

            const lastExecuted: ISODateTimeString | undefined = eventTimes[handlerName];

            const event: MutableEvent = {
                handler: () => {
                    event.lastExecuted = ISODateTimeStrings.create();
                    handler();
                },
                lastExecuted
            };

            result[handlerName] = event;

        }

        return result;

    }

    public static toEventTimes<E extends EventHandlers>(eventMap: EventMap<E>): EventTimes<E> {

        const result: MutableEventTimes<E> = <any> {};

        for (const eventName of Object.keys(eventMap)) {
            const event = eventMap[eventName];
            result[eventName] = event.lastExecuted;
        }

        return result;

    }

    public static toLastExecutedTimes<E extends EventHandlers>(eventMap: EventMap<E>): ReadonlyArray<ISODateTimeString> {

        const eventTimes = EventMaps.toEventTimes(eventMap);

        return Object.values(eventTimes)
            .filter(current => isPresent(current))
            .map(current => current!)
            .sort();

    }

    public static earliestExecution<E extends EventHandlers>(eventMap: EventMap<E>): ISODateTimeString | undefined {

        const times: Array<string | undefined> = [...this.toLastExecutedTimes(eventMap)];
        return  times.reduce(Reducers.FIRST, undefined);

    }

    public static latestExecution<E extends EventHandlers>(eventMap: EventMap<E>): ISODateTimeString | undefined {

        const times: Array<string | undefined> = [...this.toLastExecutedTimes(eventMap)];
        const result = times.reduce(Reducers.LAST, undefined);

        return result;

    }

}
