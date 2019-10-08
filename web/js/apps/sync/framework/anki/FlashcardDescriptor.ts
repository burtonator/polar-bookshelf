import {DocMeta} from '../../../../metadata/DocMeta';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard} from '../../../../metadata/Flashcard';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

export interface FlashcardDescriptor {

    readonly docMeta: IDocMeta;

    readonly pageInfo: IPageInfo;

    readonly flashcard: IFlashcard;
}
