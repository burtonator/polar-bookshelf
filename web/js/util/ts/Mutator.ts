import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

export class Mutator {

    /**
     * Create a copy of the given value, allow us to mutate it by having a
     * non-readonly method executed, then return a readonly version of the same
     * object so it can't be mutated in the future.
     *
     */
    public static mutate<T>(value: Readonly<T>, mutateFunction: MutateFunction<T>): Readonly<T> {

        // FIXME: make a shallow copy of this, not deep...
        const copyOf = Dictionaries.copyOf(value);
        return Object.freeze(mutateFunction(copyOf));

    }

}

/**
 * The opposite of Object.frozen() or Readonly
 */
type Mutatable<T> = {
    [P in keyof T]: T[P];
};

export type MutateFunction<T extends {}> = (value: Mutatable<T>) => T;

/**
 * Allows us to return a new mutation object without conflicting on the input
 * result. It requires the caller to specify whether they mutated or not which
 * can also be used for testing and provides better compile-time type safety.
 */
export interface Mutation<T> {
    readonly mutated: boolean;
    readonly value: T;
}
