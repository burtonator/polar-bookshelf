import {Dicts} from '../util/Dicts';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Flashcard} from './Flashcard';
import {Texts} from 'polar-shared/src/metadata/Texts';
import {Text} from 'polar-shared/src/metadata/Text';
import {TextType} from 'polar-shared/src/metadata/TextType';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HTMLString} from '../util/HTMLString';
import {Ref} from 'polar-shared/src/metadata/Refs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class Flashcards {

    public static CLOZE_ARCHETYPE = "76152976-d7ae-4348-9571-d65e48050c3f";
    public static FRONT_BACK_ARCHETYPE = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

    public static createMutable(flashcard: Flashcard): Flashcard {
        // TODO: an idiosyncrasy of the proxies system is that it mutates the
        // object so if it's read only it won't work.  This is a bug with
        // Proxies so I need to also fix that bug there in the future.
        return <Flashcard> {...flashcard};
    }

    public static create(type: FlashcardType, fields: {[key: string]: Text}, archetype: string, ref: Ref) {

        Preconditions.assertPresent(fields, "fields");

        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        // TODO: implement 'machine codes' here where we have a unique code per
        // physical device.  This way two people can create the same flashcard
        // and never conflict.  This way we support distributed behavior.
        const id = Hashcodes.createID({fields, created});

        return Flashcard.newInstance(id, id, created, lastUpdated, type, fields, archetype, ref);

    }

    public static createCloze(text: HTMLString, ref: Ref) {

        const archetype = this.CLOZE_ARCHETYPE;

        const fields: {[key: string]: Text } = {};

        fields.text = Texts.create(text, TextType.HTML);

        return Flashcards.create(FlashcardType.CLOZE, fields, archetype, ref);

    }

    /**
     * Create a flashcard from the raw, completed, schema form data.
     */
    public static createFrontBack(front: HTMLString, back: HTMLString, ref: Ref) {

        const archetype = this.FRONT_BACK_ARCHETYPE;

        const fields: {[key: string]: Text } = {};

        fields.front = Texts.create(front, TextType.HTML);
        fields.back = Texts.create(back, TextType.HTML);

        return Flashcards.create(FlashcardType.BASIC_FRONT_BACK, fields, archetype, ref);

    }

    public static convertFieldsToMap(fields: {[key: string]: Text } = {}) {

        const result: {[name: string]: HTMLString} = {};

        for (const key of Object.keys(fields)) {
            result[key] = fields[key].HTML!;
        }

        return result;

    }

}

export class MockFlashcards {

    /**
     * Attach mock flashcards on the given DocMeta for testing
     */
    public static attachFlashcards(docMeta: IDocMeta) {

        let idx = 0;

        Object.values(docMeta.pageMetas).forEach(pageMeta => {

            const archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

            // noinspection TsLint
            const front = Texts.create("What is the capital of California? <img src=\"data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7\" />\n" + idx, TextType.HTML);
            const back = Texts.create("Sacramento", TextType.TEXT);

            const fields = {
                'Front': front,
                'Back': back,
            };

            const ref = 'page:1';

            const flashcard = Flashcards.create(FlashcardType.CLOZE, fields, archetype, ref);

            pageMeta.flashcards[flashcard.id] = flashcard;

            ++idx;

        });

        return docMeta;

    }

}
