import {Hashcodes} from 'polar-shared/src/util/Hashcodes';

const KEY = "machine-identifier";

/**
 * Keeps a unique ID for this 'machine'.  No PII is kept in the ID.  It's just
 * an opaque string.
 */
export class MachineIDs {

    public static get(): MachineID {

        const result = localStorage.getItem(KEY);

        if (result) {
            return result;
        } else {
            const id = Hashcodes.createRandomID(20);
            localStorage.setItem(KEY, id);
            return id;
        }

    }

}

export type MachineID = string;
