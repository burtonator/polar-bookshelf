import {SyncEngine} from '../SyncEngine';
import {SyncEngineDescriptor} from '../SyncEngineDescriptor';
import {DocMetaSet} from '../../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob} from '../SyncJob';
import {DocMeta} from '../../../../metadata/DocMeta';
import {Flashcard} from '../../../../metadata/Flashcard';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Dictionaries} from '../../../../util/Dictionaries';
import * as _ from "lodash";
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {Optional} from '../../../../util/ts/Optional';
import {PendingAnkiSyncJob} from './AnkiSyncJob';
import {DocInfos} from '../../../../metadata/DocInfos';
import {Tags} from '../../../../tags/Tags';
import {DocInfo} from '../../../../metadata/DocInfo';
import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {Sets} from '../../../../util/Sets';
import {FlashcardDescriptor} from './FlashcardDescriptor';
import {FlashcardDescriptors} from './FlashcardDescriptors';
import {AnkiConnectFetch} from './AnkiConnectFetch';

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    public readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();

    public async sync(docMetaSupplierCollection: DocMetaSupplierCollection,
                      progress: SyncProgressListener,
                      deckNameStrategy: DeckNameStrategy = 'default'): Promise<PendingSyncJob> {

        // determine how to connect to Anki
        await AnkiConnectFetch.initialize();

        const noteDescriptors = await this.toNoteDescriptors(deckNameStrategy, docMetaSupplierCollection);

        const deckNames = Sets.toSet(noteDescriptors.map(noteDescriptor => noteDescriptor.deckName));

        const deckDescriptors: DeckDescriptor[] = Array.from(deckNames)
            .map(deckName => {
                return {name: deckName};
            });

        return new PendingAnkiSyncJob(progress, deckDescriptors, noteDescriptors);

    }

    protected async toNoteDescriptors(deckNameStrategy: DeckNameStrategy,
                                      docMetaSupplierCollection: DocMetaSupplierCollection): Promise<NoteDescriptor[]> {

        const  flashcardDescriptors = await FlashcardDescriptors.toFlashcardDescriptors(docMetaSupplierCollection);

        return flashcardDescriptors.map(flashcardDescriptor => {

            const deckName = this.computeDeckName(deckNameStrategy, flashcardDescriptor.docMeta.docInfo);

            const fields: {[name: string]: string} = {};

            // need to create the fields 'front' and 'back'
            Dictionaries.forDict(flashcardDescriptor.flashcard.fields, (key, value) => {
                fields[key] = Optional.of(value.HTML || value.TEXT || value.MARKDOWN).getOrElse('');
            });

            const docInfoTags = Optional.of(flashcardDescriptor.docMeta.docInfo.tags);

            const tags = docInfoTags.map(current => Object.values(current))
                       .getOrElse([])
                       .map(tag => tag.label);

            // TODO: implement more model types... not just basic.

            const modelName = FlashcardDescriptors.toModelName(flashcardDescriptor);

            return {
                guid: flashcardDescriptor.flashcard.guid,
                deckName,
                modelName,
                fields,
                tags
            };

        });

    }

    protected computeDeckName(deckNameStrategy: DeckNameStrategy, docInfo: DocInfo): string {

        let deckName: string | undefined;

        const tags = docInfo.tags;

        if (tags) {

            // TODO: test this..

            deckName = Object.values(tags)
                .filter(tag => tag.label.startsWith("deck:"))
                .map(tag => Tags.parseTypedTag(tag.label))
                .filter(typedTag => typedTag.isPresent())
                .map(typedTag => typedTag.get())
                .map(typedTag => typedTag.value)
                .map(typedTag => typedTag.replace(/_/g, "::"))
                .pop();
        }

        if (! deckName) {

            if (deckNameStrategy === 'default') {
                return "Default";
            }

            deckName = DocInfos.bestTitle(docInfo);

        }

        return deckName;

    }

}


class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    public readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    public readonly name: string = "anki";

    public readonly description: string = "Sync Engine for Anki";

}

/**
 * The strategy for computing the deck name for the flashcards.
 *
 * default: Use the Default deck.
 *
 * per-document: Create a deck per document.
 */
export type DeckNameStrategy = 'default' | 'per-document';
