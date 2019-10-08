import {Dictionaries} from "polar-shared/src/util/Dictionaries";

import chai from 'chai';
// const chaiDiff = require("chai-diff");

const assert = chai.assert;
const expect = chai.expect;

chai.config.truncateThreshold = 0;
// chai.use(chaiDiff);

export function assertJSON(actual: any,
                           expected: any,
                           message?: string,
                           unsorted?: boolean) {

    // first convert both to JSON if necessary.
    actual = toJSON(actual, unsorted);
    expected = toJSON(expected, unsorted);

    if ( actual !== expected) {
        console.error("BEGIN ACTUAL ==========");
        console.error(actual);
        console.error("END ACTUAL   ==========");
    }

    try {
        expect(actual).equal(expected, message);
    } catch (e) {
        console.error(e.message);
        throw e;
    }

}

export function toJSON(obj: any, unsorted: boolean = false): string {

    if (typeof obj === "string") {
        // first parse it as as JSON into an object so it's serialized using
        // the same canonical function below.
        obj = JSON.parse(obj);
    }

    // if(obj instanceof Array) {
    //     if( obj.length >= 1 ) {
    //         if ((typeof obj[0]) === "string") {
    //             return obj;
    //         }
    //     }
    // }

    // also accept an array of strings.

    const replacer = (key: any, value: any) => {

        // handle set replacement...
        if (typeof value === 'object' && value instanceof Set) {
            return [...value];
        }

        return value;

    };

    if (! Array.isArray(obj) && !unsorted) {

        // TODO: because of the toJSON method we might want to call JSON
        // stringify, then parse it again, then sort, then stringify again.

        obj = Dictionaries.sorted(obj);
    }

    return JSON.stringify(obj, replacer, "  ");

}
