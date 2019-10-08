/**
 * All JSON must go through the metadata serializer so we can handle proper
 * serialization but also object validation once they are deserialized.
 */
import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';

export class MetadataSerializer {

    public static serialize(object: any, spacing: string = "") {
        return JSON.stringify(object, null, spacing);
    }

    /**
     * Given an instance of an object, and a JSON string, deserialize the string into
     * the object.
     * @param object {Object} the object which should be returned after deserializing.
     * @param data
     */
    public static deserialize(obj: any, data: string) {

        Preconditions.assertPresent(data, 'data');

        if (! (typeof data === "string")) {
            // extra check when called from JS
            throw new Error("We can only deserialize strings: " + typeof data);
        }

        const parsed = JSON.parse(data);
        Object.assign(obj, parsed);
        return obj;

    }

    private static replacer(key: string, value: any) {

        if (value instanceof SerializedObject) {
            value.setup();
            value.validate();
        }

        return value;

    }

    private static reviver(key: string, value: any) {

        if (value instanceof SerializedObject) {
            value.setup();
            value.validate();
        }

        return value;

    }

}
