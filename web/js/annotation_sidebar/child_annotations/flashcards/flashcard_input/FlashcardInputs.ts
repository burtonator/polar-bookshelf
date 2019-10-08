import {Flashcard} from '../../../../metadata/Flashcard';
import {HTMLStr} from "polar-shared/src/util/Strings";

export type FlashcardInputFieldsType = FrontAndBackFields | ClozeFields;

export interface ClozeFields {
    text: HTMLStr;
}

export interface FrontAndBackFields {
    front: HTMLStr;
    back: HTMLStr;
}

export class FlashcardInputs {

    public static fieldToString(name: string, existingFlashcard?: Flashcard): string {

        if (existingFlashcard) {

            if (existingFlashcard.fields[name] && existingFlashcard.fields[name].HTML) {
                return existingFlashcard.fields[name].HTML!;
            }

        }

        return "";

    }

}


