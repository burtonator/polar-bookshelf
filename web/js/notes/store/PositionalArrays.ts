import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

/**
 * Positional Arrays are based on LSeq:
 *
 * LSEQ: an Adaptive Structure for Sequences in DistributedCollaborative Editing
 *
 * The general idea here is that we can implement distributed arrays as CRDT-like stuctures
 * where the keys are the position in a map and the 'array' order is determined by the key.
 *
 * This is a ROUGH approximation of the LSEQ idea but designed for rapid
 * iteration and fewer total keys.
 *
 * https://bartoszsypytkowski.com/operation-based-crdts-arrays-1/
 * https://www.researchgate.net/publication/262162421_LSEQ_an_Adaptive_Structure_for_Sequences_in_Distributed_Collaborative_Editing
 *
 *
 */
export namespace PositionalArrays {

    // FIXME: I think this implementation has the following bugs:
    //
    // If someone tries to delete the first element, and I try to add it then
    // it's possible to compute the same key. We can resolve this by having a
    // local portion so this is impossible since to can't generate teh same
    // code.
    // FIXME: need a local component
    //

    //
    // FIXME: We might want to to think about a tree with all positive integers with an arity of say 10000
    // and a spacing of say 10... then when this is filled up another level of 10000

    /**
     * A number encoded as an string that can be used to place something into a
     * positional array.
     */
    export type PositionalArrayPositionStr = string;

    export type PositionalArray<T> = {[position: string /* PositionalArrayPosition */]: T};

    export interface IPositionalArrayPosition<T> {
        readonly pos: number;
        readonly value: T;
    }

    /**
     * An entry in the dictionary.
     */
    type PositionalArrayEntry<T> = [string, T];

    export function create<T>(values?: ReadonlyArray<T>): PositionalArray<T> {

        const result: PositionalArray<T> = {};

        if (values !== undefined) {
            for(const value of values) {
                append(result, value);
            }
        }

        return result;
    }

    export function entries<T>(positionalArray: PositionalArray<T>): ReadonlyArray<PositionalArrayEntry<T>> {
        return Object.entries(positionalArray);
    }

    export function compare<T>(a: PositionalArrayEntry<T>, b: PositionalArrayEntry<T>) {
        return parseFloat(a[0]) - parseFloat(b[0]);
    }

    export function insert<T>(positionalArray: PositionalArray<T>,
                              ref: T,
                              value: T,
                              pos: 'before' | 'after'): PositionalArray<T> {

        const sorted = arrayStream(entries(positionalArray))
            .sort((a, b) => compare(a, b))
            .collect();

        const pointers = arrayStream(Tuples.createSiblings(sorted))
              .sort((a, b) => compare(a.curr, b.curr))
              .collect();

        const ptr = arrayStream(pointers)
              .filter(current => current.curr[1] === ref)
              .first();

        if (ptr) {

            const computeKey = () => {

                const base = parseFloat(ptr.curr[0]);

                const computeDelta = () => {

                    const computeDeltaFromSibling = (entry: PositionalArrayEntry<T> | undefined) => {

                        if (entry !== undefined) {
                            return Math.abs(parseFloat(entry[0]) - base) / 2;
                        } else {
                            return 1.0;
                        }

                    }

                    switch(pos) {

                        case "before":
                            return computeDeltaFromSibling(ptr.prev) * -1;
                        case "after":
                            return computeDeltaFromSibling(ptr.next);

                    }

                }

                const delta = computeDelta();

                const idx = base + delta;
                return `${idx}`;

            }

            const key = computeKey();
            positionalArray[key] = value;

            return positionalArray;

        } else {
            throw new Error(`Unable to find reference to ${ref} in: ` + JSON.stringify(positionalArray));
        }

    }

    /**
     * Put a value into the positional array with the exact key position.
     */
    export function put<T>(positionalArray: PositionalArray<T>,
                           key: PositionalArrayPositionStr,
                           value: T): PositionalArray<T> {

        positionalArray[key] = value;
        return positionalArray;

    }

    export function unshift<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const min
            = arrayStream(Object.keys(positionalArray))
            .map(parseFloat)
            .sort((a, b) => a - b)
            .first() || 0.0;

        const idx = min - 1.0;

        const key = `${idx}`;

        positionalArray[key] = value;

        return positionalArray;
    }

    export function append<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const max
            = arrayStream(Object.keys(positionalArray))
                .map(parseFloat)
                .sort((a, b) => a - b)
                .last() || 0.0;

        const idx = max + 1.0;

        const key = `${idx}`;

        positionalArray[key] = value;

        return positionalArray;
    }

    export function remove<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const key = arrayStream(Object.entries(positionalArray))
                        .filter(current => current[1] === value)
                        .map(current => current[0])
                        .first();

        if (key !== undefined) {
            delete positionalArray[key];
            return positionalArray;
        }

        return positionalArray;

    }

    export function clear<T>(positionalArray: PositionalArray<T>) {

        for(const key of Object.keys(positionalArray)) {
            delete positionalArray[key];
        }

    }

    /**
     * Set will take new items, and give them keys that will be unique, then
     * remove the old keys.  This way the set has new values and it's safe from
     * the existing data and can't conflict with anyone.
     */
    export function set<T>(positionalArray: PositionalArray<T>, values: ReadonlyArray<T> | PositionalArray<T>): PositionalArray<T> {

        // FIXME: instead of appending, then removing the existing, it might be
        // better to delete the removed items, then place the added items in the
        // right positions.  This way none of the existing item keys will be
        // changed.

        const convertToArray = (): ReadonlyArray<T> => {

            if (Array.isArray(values)) {
                return values;
            }

            if (typeof values === 'object') {
                return toArray(values as any);
            }

            throw new Error("Unknown values");

        }

        const converted = convertToArray();

        // *** get all of the existing keys so that we can remove them later
        const existing = Object.keys(positionalArray);

        // *** now append all the current ones.
        for (const value of converted) {
            append(positionalArray, value);
        }

        // *** now delete all the existing values...
        for (const key of existing) {
            delete positionalArray[key];
        }

        return positionalArray;

    }

    export function keyForValue<T>(positionalArray: PositionalArray<T>, value: T): PositionalArrayPositionStr | undefined {

        return arrayStream(Object.entries(positionalArray))
            .filter(current => current[1] === value)
            .map(current => current[0])
            .first()

    }

    /**
     * This is needed by the UI so that we can sort base on position.
     */
    export function toArray<T>(positionalArray: PositionalArray<T>): ReadonlyArray<T> {

        const toPosition = (entry: PositionalArrayEntry<T>): IPositionalArrayPosition<T> => {
            return {
                pos: parseFloat(entry[0]),
                value: entry[1]
            }
        }

        return Object.entries(positionalArray)
                     .map(toPosition)
                     .sort((a,b) => a.pos - b.pos)
                     .map(current => current.value);

    }

}
