import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

export namespace PositionalArrays {

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

    export function insert<T>(positionalArray: PositionalArray<T>,
                              ref: T,
                              value: T,
                              pos: 'before' | 'after'): PositionalArray<T> {

        const sorted = arrayStream(entries(positionalArray))
            .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
            .collect();

        const pointers = arrayStream(Tuples.createSiblings(sorted))
              .sort((a, b) => parseFloat(a.curr[0]) - parseFloat(b.curr[0]))
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

    export function set<T>(positionalArray: PositionalArray<T>, values: ReadonlyArray<T>): PositionalArray<T> {

        clear(positionalArray);

        for (const value of values) {
            append(positionalArray, value);
        }

        return positionalArray;

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