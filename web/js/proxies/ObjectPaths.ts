/**
 * A simple map of the object and the path to get to that object.
 *
 * We're able walk an entire object decomposing it into a list of
 * ObjectPathEntry objects which make it easier to test and debug rather than
 * dealing with recursive objects.
 *
 * The output will be a list of path objects.
 *
 *
 */
import {ObjectPathEntry} from './ObjectPathEntry';
import {Paths} from 'polar-shared/src/util/Paths';

export class ObjectPaths {

    static recurse(obj: any) {

        let result: ObjectPathEntry[] = [];

        ObjectPaths._recurse("/", obj, null, null, result);

        // sort the result to give the data back sorted by path.  It's
        // deterministic either way but its nice for testing to have them sorted
        // by path
        result.sort(function (val0, val1) {
            return val0.path.localeCompare(val1.path);
        });

        return result;

    }

    static _recurse(path: string,
                    obj: any,
                    parent: any,
                    parentKey: string | null,
                    result: ObjectPathEntry[]) {

        if(typeof obj !== "object") {
            throw new Error("We can only recurse on object types.");
        }

        result.push(new ObjectPathEntry(path, obj, parent, parentKey));

        for (let childKey in obj) {

            if (obj.hasOwnProperty(childKey)) {

                let childVal = obj[childKey];

                if (childVal && typeof childVal === "object") {
                    let childPath = Paths.create(path, childKey);
                    ObjectPaths._recurse(childPath, childVal, obj, childKey, result);
                }

            }

        }

    }

}
