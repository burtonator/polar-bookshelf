import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {FlashcardDescriptor} from './FlashcardDescriptor';
import {Flashcard} from '../../../../metadata/Flashcard';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import * as _ from 'lodash';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

const log = Logger.create();

export class FlashcardDescriptors {

    public static async toFlashcardDescriptors(docMetaSupplierCollection: DocMetaSupplierCollection): Promise<FlashcardDescriptor[]> {

        const result: FlashcardDescriptor[] = [];

        for (const docMetaSupplier of docMetaSupplierCollection) {

            try {

                const docMeta = await docMetaSupplier();

                Object.values(docMeta.pageMetas).forEach(pageMeta => {

                    // collect all flashcards for the current page.

                    const flashcards: IFlashcard[] = [];

                    flashcards.push(... Dictionaries.values(pageMeta.flashcards));

                    flashcards.push(... _.chain(pageMeta.textHighlights)
                        .map(current => Dictionaries.values(current.flashcards))
                        .flatten()
                        .value());

                    flashcards.push(... _.chain(pageMeta.areaHighlights)
                        .map(current => Dictionaries.values(current.flashcards))
                        .flatten()
                        .value());

                    const flashcardDescriptors = _.chain(flashcards)
                        .map(current => <FlashcardDescriptor> {
                            docMeta,
                            pageInfo: pageMeta.pageInfo,
                            flashcard: current
                        })
                        .value();

                    result.push(...flashcardDescriptors);

                });

            } catch (e) {
                log.error("Unable to handle docMeta: ", e);
            }

        }

        return result;

    }

    public static toModelName(flashcardDescriptor: FlashcardDescriptor) {

        if (flashcardDescriptor.flashcard.type === FlashcardType.CLOZE) {
            return "Cloze";
        }

        return "Basic";

    }

}
