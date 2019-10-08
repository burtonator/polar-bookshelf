import {MockAdvertisingPersistenceLayer} from "../datastore/advertiser/MockAdvertisingPersistenceLayer";
import {DefaultPersistenceLayer} from '../datastore/DefaultPersistenceLayer';
import {MemoryDatastore} from '../datastore/MemoryDatastore';
import {ModelPersister} from './ModelPersister';
import {DocMetas, MockDocMetas} from '../metadata/DocMetas';
import {assert} from 'chai';
import {Promises} from "../util/Promises";
import waitForExpect from 'wait-for-expect';
import {DocMeta} from "../metadata/DocMeta";
import {DefaultPersistenceLayerHandler} from '../datastore/PersistenceLayerHandler';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

describe('ModelPersister', function() {

    this.timeout(10000);

    async function assertWrites(nrWrites: number) {

        await Promises.waitFor(1000);

        await waitForExpect(() => {
            assert.equal(modelPersister.nrWrites, nrWrites);
        });

        await Promises.waitFor(1000);

        await waitForExpect(() => {
            assert.equal(modelPersister.nrWrites, nrWrites);
        });

    }

    let persistenceLayer: MockAdvertisingPersistenceLayer;

    let docMeta: IDocMeta;

    let modelPersister: ModelPersister;

    beforeEach(function() {

        console.log("beforeEach:")

        persistenceLayer =
            new MockAdvertisingPersistenceLayer(
                new DefaultPersistenceLayer(
                    new MemoryDatastore()), true);

        docMeta = MockDocMetas.createMockDocMeta();

        const persistenceLayerHandler = new DefaultPersistenceLayerHandler(persistenceLayer);
        modelPersister = new ModelPersister(persistenceLayerHandler, docMeta);

        docMeta = modelPersister.docMeta;


    });


    describe('batched', function() {

        it("with simple write", async function() {

            docMeta.docInfo.title = 'asdf';

            await assertWrites(1);

        });

        it("with batched write", async function() {

            DocMetas.withBatchedMutations(docMeta, () => {
                docMeta.docInfo.title = 'asdf';
                docMeta.docInfo.description = 'hello world';

                const pageMeta = DocMetas.getPageMeta(docMeta, 1);
                pageMeta.pageInfo.dimensions = {width: 100, height: 100};

            });

            await assertWrites(1);

        });

        it("with no batched write", async function() {

            DocMetas.withBatchedMutations(docMeta, () => {
                // no writes
            });

            await assertWrites(0);

        });

    });

    describe('skipped', function() {

        it("with skipped write", async function() {

            DocMetas.withSkippedMutations(docMeta, () => {

                docMeta.docInfo.title = 'asdf';
                docMeta.docInfo.description = 'hello world';

                const pageMeta = DocMetas.getPageMeta(docMeta, 1);
                pageMeta.pageInfo.dimensions = {width: 100, height: 100};
            });

            await assertWrites(0);

        });

    });

});
