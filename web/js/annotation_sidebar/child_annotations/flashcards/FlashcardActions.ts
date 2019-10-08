import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FrontAndBackFields} from './flashcard_input/FlashcardInputs';
import {ClozeFields} from './flashcard_input/FlashcardInputs';
import {DocAnnotation} from '../../DocAnnotation';
import {Functions} from 'polar-shared/src/util/Functions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Flashcard} from '../../../metadata/Flashcard';
import {Refs} from 'polar-shared/src/metadata/Refs';
import {Flashcards} from '../../../metadata/Flashcards';
import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetas} from '../../../metadata/DocMetas';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class FlashcardActions {

    public static create(annotation: DocAnnotation,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields) {

        Functions.withTimeout(() => {

            const flashcard = this.newInstance(annotation, type, fields);

            if (flashcard) {
                annotation.pageMeta.flashcards[flashcard.id] = Flashcards.createMutable(flashcard);
            }

        }).catch(err => log.error(err));

    }

    public static update(docMeta: IDocMeta,
                         annotation: DocAnnotation,
                         type: FlashcardType,
                         fields: FrontAndBackFields | ClozeFields,
                         existingFlashcard?: Flashcard) {

        const flashcard = this.newInstance(annotation, type, fields);

        if (flashcard) {

            DocMetas.withBatchedMutations(docMeta, () => {

                if (existingFlashcard) {
                    delete annotation.pageMeta.flashcards[existingFlashcard.id];
                }

                annotation.pageMeta.flashcards[flashcard.id] = <Flashcard> {...flashcard};

            });

        }

    }

    /**
     * Create a new instance from the given fields.
     */
    private static newInstance(annotation: DocAnnotation,
                               type: FlashcardType,
                               fields: FrontAndBackFields | ClozeFields): Flashcard | undefined {

        const ref = Refs.createFromAnnotationType(annotation.id, annotation.annotationType);

        if (type === FlashcardType.BASIC_FRONT_BACK) {

            const frontAndBackFields = fields as FrontAndBackFields;
            const {front, back} = frontAndBackFields;

            return Flashcards.createFrontBack(front, back, ref);

        }

        if (type === FlashcardType.CLOZE) {

            const clozeFields = fields as ClozeFields;
            const {text} = clozeFields;

            return Flashcards.createCloze(text, ref);

        }

        return undefined;

    }

}
