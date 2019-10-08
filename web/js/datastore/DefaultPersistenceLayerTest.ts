import {assert} from 'chai';
import {MockDocMetas} from '../metadata/DocMetas';
import {MemoryDatastore} from './MemoryDatastore';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {TestingTime} from '../test/TestingTime';
import uuid from 'uuid';


describe('DefaultPersistenceLayer', function() {

    const fingerprint = '0x0001';

    it("verify that lastUpdated was written", async function() {

        TestingTime.freeze();

        const memoryDatastore = new MemoryDatastore();
        const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 1);

        assert.ok(docMeta.docInfo.lastUpdated === undefined);

        await persistenceLayer.writeDocMeta(docMeta);

        // verify that the original object was not mutated
        assert.ok(docMeta.docInfo.lastUpdated === undefined);

        const writtenDocMeta1 = await persistenceLayer.getDocMeta(fingerprint);

        assert.ok(writtenDocMeta1 !== undefined);

        const current = writtenDocMeta1!.docInfo.lastUpdated!;

        TestingTime.forward(1000);

        await persistenceLayer.writeDocMeta(docMeta);

        const writtenDocMeta2 = await persistenceLayer.getDocMeta(fingerprint);

        assert.ok(writtenDocMeta2 !== undefined);

        const now = writtenDocMeta2!.docInfo.lastUpdated!;

        assert.ok(current.toString() !== now.toString());

    });

    it("verify that added was written", async function() {

        TestingTime.freeze();

        const memoryDatastore = new MemoryDatastore();
        const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 1);

        await persistenceLayer.writeDocMeta(docMeta);

        const writtenDocMeta1 = await persistenceLayer.getDocMeta(fingerprint);

        assert.ok(writtenDocMeta1!.docInfo.added !== undefined);

        const current = writtenDocMeta1!.docInfo.added!;

        TestingTime.forward(1000);

        await persistenceLayer.writeDocMeta(docMeta);

        const writtenDocMeta2 = await persistenceLayer.getDocMeta(fingerprint);

        const now = writtenDocMeta2!.docInfo.added!;

        assert.ok(current.toString() === now.toString());

        // now verify that if we write a second time, that the added value
        // is NOT changed.

    });

});
