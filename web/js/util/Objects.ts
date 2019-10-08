export class Objects {

    /**
     * Take the current object, and use given object as a set of defaults.
     */
    public static defaults(current: any, defaults: any) {

        let result = current;

        if (!result) {
            result = {};
        }

        for (const key in defaults) {

            if (defaults.hasOwnProperty(key) && ! result.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }

        return result;

    }

    /**
     * Clear an array or dictionary of all its values so it is reset.
     * This modifies the object directly.
     *
     * @param obj
     */
    public static clear(obj: any) {

        if (obj instanceof Array) {

            for (let idx = 0; idx < obj.length; ++idx) {
                obj.pop();
            }

            return obj;

        }

        if (typeof obj === "object") {

            for (const key in obj) {
                delete obj[key];
            }

            return obj;

        }

        throw new Error("Only works for arrays or objects");

    }

    public static duplicate(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    public static create<T>(proto: any): T {
        return Object.create(proto);
    }

    /**
     * Create an instance of an object from its prototype and use some Typescript
     * generic promotion to make it work properly.
     */
    public static createInstance<T>(prototype: T, val: any) {
        const result: T = Objects.create(prototype);
        Object.assign(result, val);
        return result;
    }

    public static typedKeys<T>(obj: T): Array<(keyof T)> {
        // type cast should be safe because that's what really Object.keys() does
        return Object.keys(obj) as Array<(keyof T)>;
    }

}


/**
 * Create a canonical representation of an object easily so the handler can
 * delete values or set things and just return an object.
 */
export function canonicalize<V>(val: V, handler: (obj: any) => void): any {

    if (val === undefined || val === null) {
        return val;
    }

    const cpy = {...val}
    handler(cpy);
    return cpy;

}

function create<T>(proto: any): T {
    return Object.create(proto);
}

function createInstance<T>(prototype: T, val: any) {
    let result: T = create(prototype);
    Object.assign(result, val);
    return result;
}

