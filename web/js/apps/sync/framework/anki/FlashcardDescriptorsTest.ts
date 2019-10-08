import {MediaContents} from './MediaContents';
import {assertJSON} from '../../../../test/Assertions';
import {DiskDatastore} from '../../../../datastore/DiskDatastore';
import {FlashcardDescriptors} from './FlashcardDescriptors';
import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {DocMeta} from '../../../../metadata/DocMeta';
import {DefaultPersistenceLayer} from '../../../../datastore/DefaultPersistenceLayer';
import {assert} from 'chai';

describe('FlashcardDescriptors', function() {

    xit("basic", async function() {

        const diskDatastore = new DiskDatastore();
        const persistenceLayer = new DefaultPersistenceLayer(diskDatastore);
        await persistenceLayer.init();

        const docMeta = await persistenceLayer.getDocMeta("12FWNxnJk2yGPAXKQgH7");

        const docMetaSupplierCollection: DocMetaSupplierCollection = [ async () => docMeta!];

        const flashcardDescriptors = await FlashcardDescriptors.toFlashcardDescriptors(docMetaSupplierCollection);

        assert.equal(flashcardDescriptors.length, 2);

        console.log("FIXME: ", JSON.stringify(flashcardDescriptors, null, "  "));

    });


});
