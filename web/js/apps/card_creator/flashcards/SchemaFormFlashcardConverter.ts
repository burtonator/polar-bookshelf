import {Logger} from 'polar-shared/src/logger/Logger';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';
import {Flashcard} from '../../../metadata/Flashcard';
import {Flashcards} from '../../../metadata/Flashcards';
import {Ref} from 'polar-shared/src/metadata/Refs';

const log = Logger.create();

export class SchemaFormFlashcardConverter {

    public static convert(schemaFormData: SchemaFormData, archetype: string, ref: Ref): Flashcard {

        log.info("Converting SchemaFormData: ", schemaFormData);

        return Flashcards.createFromSchemaFormData(schemaFormData.formData, archetype, ref);

    }

}
