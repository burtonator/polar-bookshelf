import {assert} from 'chai';
import {LazyWriteDatastore} from './LazyWriteDatastore';
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';
import {TestingTime} from '../test/TestingTime';
import {DocMetaFileRefs} from './DocMetaRef';

describe('LazyWriteDatastore', function() {

    it('Basic', async function() {

        TestingTime.freeze();

        const memoryDatastore = new MemoryDatastore();
        const lazyWriteDatastore = new LazyWriteDatastore(memoryDatastore);

        assert.equal(lazyWriteDatastore.nrWrites, 0);
        let docMeta = MockDocMetas.createMockDocMeta();

        await lazyWriteDatastore.writeDocMeta(docMeta);
        assert.equal(lazyWriteDatastore.nrWrites, 1);

        await lazyWriteDatastore.writeDocMeta(docMeta);
        assert.equal(lazyWriteDatastore.nrWrites, 1);

        TestingTime.forward(1000);

        docMeta = MockDocMetas.createMockDocMeta();

        await lazyWriteDatastore.writeDocMeta(docMeta);
        assert.equal(lazyWriteDatastore.nrWrites, 2);

    });


    it('delete', async function() {

        TestingTime.freeze();

        const memoryDatastore = new MemoryDatastore();
        const lazyWriteDatastore = new LazyWriteDatastore(memoryDatastore);

        assert.equal(lazyWriteDatastore.nrWrites, 0);
        const docMeta = MockDocMetas.createMockDocMeta();

        await lazyWriteDatastore.writeDocMeta(docMeta);
        assert.equal(lazyWriteDatastore.nrWrites, 1);

        await lazyWriteDatastore.delete(DocMetaFileRefs.createFromDocMeta(docMeta));

        await lazyWriteDatastore.writeDocMeta(docMeta);
        assert.equal(lazyWriteDatastore.nrWrites, 2);

    });

});
