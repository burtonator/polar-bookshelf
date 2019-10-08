import {ObjectID} from '../util/ObjectIDs';

export function lazyObjEquals(a: LazyMap, b: LazyMap) {

    for (const key of Object.keys(a)) {

        if (! lazyEquals(a[key], b[key])) {
            return false;
        }

    }

    return true;

}

function typ(val: any): string {

    if (val === null) {
        return 'null';
    }

    return typeof val;

}

export function lazyEquals(a: LazyType, b: LazyType) {

    // typeof null is 'object'

    const nrUndefined = [a, b].filter(val => val === undefined).length;
    const nrNull = [a, b].filter(val => val === null).length;

    if ([1].includes(nrUndefined)) {
        return false;
    }

    if ([1].includes(nrNull)) {
        return false;
    }

    // TODO: it should be possible to work with any combination of deep objects
    // as long as they don't have functions or things that are difficult to
    // compare.

    const aObj = <any> a;
    const bObj = <any> b;

    if (aObj && aObj.oid && bObj && bObj.oid) {
        return aObj.oid === bObj.oid;
    }

    return a === b;

}

export interface LazyProps extends LazyMap {

}

export interface LazyState extends LazyMap {

}

export interface LazyMap {
    [key: string]: LazyType | undefined | null;
}


// TODO: support arrays of primitives plus arrays of ObjectID.
export type LazyType = string | number | boolean | ObjectID | undefined | null;

