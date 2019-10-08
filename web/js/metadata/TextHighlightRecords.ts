import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {TextHighlight} from './TextHighlight';
import {Text} from 'polar-shared/src/metadata/Text';
import {TextRect} from './TextRect';
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ITextRect} from "polar-shared/src/metadata/ITextRect";
import {Arrays} from "polar-shared/src/util/Arrays";

export class TextHighlightRecords {

    /**
     * Create a TextHighlight by specifying all required rows.
     *
     * We also automatically assign the created and lastUpdated values of this
     * object as we're working with it.
     *
     * @return an object with an "id" for a unique hash and a "value" of the
     * TextHighlight to use.
     */
    public static create(rects: IRect[],
                         textSelections: ITextRect[],
                         text: Text,
                         color: HighlightColor = 'yellow'): TextHighlightRecord {

        const id = Hashcodes.createID(rects);

        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        const textHighlight = new TextHighlight({
            id,
            created,
            lastUpdated,
            rects: Arrays.toDict(rects),
            textSelections: Arrays.toDict(textSelections),
            text,
            images: {},
            notes: {},
            questions: {},
            flashcards: {},
            guid: id,
            color
        });

        return {id, value: textHighlight};

    }

}

export interface TextHighlightRecord {
    readonly id: string;
    readonly value: ITextHighlight;
}
