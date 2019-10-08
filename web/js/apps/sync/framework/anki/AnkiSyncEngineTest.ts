import {MediaContents} from './MediaContents';
import {assertJSON} from '../../../../test/Assertions';
import {DiskDatastore} from '../../../../datastore/DiskDatastore';
import {FlashcardDescriptors} from './FlashcardDescriptors';
import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {DocMeta} from '../../../../metadata/DocMeta';
import {DefaultPersistenceLayer} from '../../../../datastore/DefaultPersistenceLayer';
import {assert} from 'chai';
import {AnkiSyncEngine} from './AnkiSyncEngine';
import {Texts} from '../../../../metadata/Texts';
import {TextType} from '../../../../metadata/TextType';
import {Flashcards} from '../../../../metadata/Flashcards';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {DocMetas, MockDocMetas} from '../../../../metadata/DocMetas';

xdescribe('AnkiSyncEngine', function() {

    function createMockFlashcard() {

        const text = Texts.create("This is the {{c1::cloze deletion}} text", TextType.MARKDOWN);

        const fields = { text };

        const archetype = "76152976-d7ae-4348-9571-d65e48050c3f";

        return Flashcards.create(FlashcardType.CLOZE, fields, archetype, 'page:1');

    }

    function createMockDocMeta() {

        const docMeta = MockDocMetas.createMockDocMeta();

        const flashcard = createMockFlashcard();

        const pageMeta = DocMetas.getPageMeta(docMeta, 1);

        pageMeta.flashcards[flashcard.id] = flashcard;

        return docMeta;

    }

    it("basic", async function() {

        const ankiSyncEngine = new AnkiSyncEngine();

        const docMeta = createMockDocMeta();

        const job = await ankiSyncEngine.sync([async () => docMeta], () => console.log("got sync event"));

        await job.start();

    });



});
