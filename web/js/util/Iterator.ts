import {isBoolean} from 'util';

/**
 * A class that can create an Iterator.
 */
export interface Iterable<T> {

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol
    [Symbol.iterator]: Iterator<T>;

}

export interface Iterator<T> {

    hasNext(): boolean;
    next(): T;

}

// NOTE: I don't think this is necessariy if I use the array iterator protocol
//
// class ArrayIterator<T> implements Iterator<T> {
//
//     private readonly data: ReadonlyArray<T>;
//
//     private ptr = 0;
//
//     constructor(data: ReadonlyArray<T>) {
//         this.data = data;
//     }
//
//     public hasNext(): boolean {
//         return this.ptr < this.data.length;
//     }
//
//     public next(): T {
//         const done = this.ptr >= this.data.length;
//     }
//
// }
//
// export class Iterators {
//
//     public static fromArray<T>(data: ReadonlyArray<T>): Iterator<T> {
//         return new ArrayIterator(data);
//     }
//
// }
