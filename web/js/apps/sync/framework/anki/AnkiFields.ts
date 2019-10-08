import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

export class AnkiFields {

    public static normalize(fields: FieldsMap) {

        const result: FieldsMap = {};

        Dictionaries.forDict(fields, (key, value) => {
            key = key.charAt(0).toUpperCase() + key.substr(1);
            result[key] = value;
        });

        return result;

    }

}

interface FieldsMap {[key: string]: string}
