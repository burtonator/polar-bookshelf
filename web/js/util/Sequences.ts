import util from 'util';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Strings} from "polar-shared/src/util/Strings";

/**
 * Creates human readable sequences that are opaque strings.  They only need to
 * be sortable so that newer sequences sort after earlier ones.
 *
 *
 */
export class Sequences {

    public static MACHINE: number = Math.floor(999999999999 * Math.random());

    public static NONCE: number = 0;

    public static create(): Sequence {

        if (this.NONCE > 999999) {
            this.NONCE = 0;
        }

        // 41ccf660-fb5a-11e8-ae78-3bf708237363

        const now = new Date();

        const nonce = Strings.lpad(this.NONCE++, '0', 6); // how do I deal with nonce rollover?  I just need to handle
        const machine = Strings.lpad(this.MACHINE, '0', 12);

        // use a z prefix so it sorts last in string comparison.
        return 'z' + ISODateTimeStrings.create() + `+${nonce}-${machine}`;

    }


}

export type Sequence = string;
