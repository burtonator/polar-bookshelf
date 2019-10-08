import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Comment} from './Comment';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {TextType} from './TextType';
import {Texts} from './Texts';
import {Ref} from 'polar-shared/src/metadata/Refs';

export class Comments {

    public static SEQUENCE: number = 0;

    public static createID() {

        const seq = this.SEQUENCE++;
        const now = Date.now();
        return Hashcodes.createID({seq, now}, 20);

    }

    public static createTextComment(text: string, ref: Ref) {

        const content = Texts.create(text, TextType.TEXT);

        const id = this.createID();
        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

    public static createHTMLComment(text: string,
                                    ref: Ref,
                                    created?: ISODateTimeString,
                                    lastUpdated?: ISODateTimeString ) {

        const content = Texts.create(text, TextType.HTML);

        const id = this.createID();

        if (! created) {
            created = ISODateTimeStrings.create();
        }

        if (! lastUpdated) {
            lastUpdated = created;
        }

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

}
