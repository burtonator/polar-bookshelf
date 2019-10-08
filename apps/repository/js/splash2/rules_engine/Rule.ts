/**
 * A rule accepts facts and determines if it should run and then emits a
 * new facts object.
 */
import {EventMap} from './Engine';
import {EventHandlers} from './Engine';

export interface Rule<F, H extends EventHandlers, S> {

    /**
     * Execute the rule and return new a new facts object. If the rule doesn't
     * wish to perform any actions just return the facts without mutation.
     *
     */
    run(facts: Readonly<F>, eventMap: EventMap<H>, state?: Readonly<S>): RuleFactPair<F, S>;

}

export type RuleFactPair<F, S> = [F, S];

/**
 * Rule ID string.  All lowercase with hyphen supported.
 */
export type RuleID = string;
