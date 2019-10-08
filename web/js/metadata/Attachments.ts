/**
 * Create a new pagemark with the created time, and other mandatory fields
 * added.
 *
 */
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Attachment} from './Attachment';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';

// used to avoid collision if we create multiple too fast.
let sequence = 0;

export class Attachments {

    public static createID(created: ISODateTimeString) {

        const id = Hashcodes.create(JSON.stringify({created, sequence: sequence++}));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0, 10);

    }

    public static create(type: string, data: string): Attachment {

        const created = ISODateTimeStrings.create();
        const id = this.createID(created);

        return new Attachment({
            id,
            created,
            type,
            data
        });

    }

}

