import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {DefaultDatastoreMutation} from '../../js/datastore/DatastoreMutation';
import {DocInfo} from '../../js/metadata/DocInfo';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import {Datastores} from '../../js/datastore/Datastores';
import waitForExpect from 'wait-for-expect';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(600000);

const fingerprint = "0x001";

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        const firebaseDatastore = new FirebaseDatastore();

        await firebaseDatastore.init();

        describe('FirebaseDatastore tests', function() {

            xit("Make sure we get events from the datastore", async function() {

                let datastore = new FirebaseDatastore();

                const persistenceLayer = new DefaultPersistenceLayer(datastore);

                await persistenceLayer.init();

                await Datastores.purge(datastore, purgeEvent => {
                    log.info("purgeEvent: ", purgeEvent);
                });

                await waitForExpect(async () => {
                    const docMetaFiles = await persistenceLayer.getDocMetaRefs();
                    assert.equal(docMetaFiles.length, 0);
                });

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                const datastoreMutation = new DefaultDatastoreMutation<IDocInfo>();

                const docReplicationEventListenerCalled: boolean = false;

                // datastore.addDocMetaSynchronizationEventListener((docMutation) => {
                //     docReplicationEventListenerCalled = true;
                // });

                await persistenceLayer.write(fingerprint, docMeta, {datastoreMutation});

                assert.isFalse(docReplicationEventListenerCalled, "No doc replication event listener called");

                await waitForExpect(async () => {
                    const docMetaFiles = await persistenceLayer.getDocMetaRefs();
                    assert.equal(docMetaFiles.length, 1);
                });

                await persistenceLayer.stop();

                // now create a new datastore to make sure we get the events we
                // need.

                datastore = new FirebaseDatastore();

                const docMutationLatch = new Latch<boolean>();
                const docReplicationLatch = new Latch<boolean>();

                // datastore.addDocMetaSnapshotEventListener((docMetaSnapshotEvent) => {
                //
                //     console.log("FIXME: here at least: ", docMetaSnapshotEvent);
                //
                //     for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                //
                //         const {mutationType} = docMetaMutation;
                //
                //         const docInfo = await docMetaMutation.docInfoProvider();
                //
                //         if (docInfo.fingerprint === fingerprint && mutationType === 'created') {
                //             console.log("FIXME: got first");
                //             docMutationLatch.resolve(true);
                //         }
                //
                //     }
                //
                // });
                //
                // datastore.addDocMetaSynchronizationEventListener((docMetaSnapshotEvent) => {
                //
                //     console.log("FIXME: here at least: ", docMetaSnapshotEvent);
                //
                //     for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                //
                //         const {mutationType } = docMetaMutation;
                //
                //         const docInfo = docMetaMutation.docInfoProvider();
                //
                //         if (docInfo.fingerprint === fingerprint &&  mutationType === 'created') {
                //             console.log("FIXME: got seconde");
                //             docReplicationLatch.resolve(true);
                //         }
                //
                //     }
                //
                //
                // });

                await datastore.init();

                // if this latch is resolved we've found our value.
                await docMutationLatch.get();
                await docReplicationLatch.get();

                await datastore.stop();

            });

            xit("Make sure we get replication events from a second datastore to the first", async function() {

                class ReplicationTester {

                    public datastore?: FirebaseDatastore;

                    public persistenceLayer?: PersistenceLayer;

                    public hasDocReplicationEvent: boolean = false;

                    public async init() {
                        this.datastore = new FirebaseDatastore();
                        this.persistenceLayer = new DefaultPersistenceLayer(this.datastore);
                        await this.persistenceLayer.init();
                        return this;
                    }

                    public async setup() {

                        // this.datastore!.addDocMetaSynchronizationEventListener((docReplicationEvent) => {
                        //     this.hasDocReplicationEvent = true;
                        // });

                        return this;

                    }

                    public async write() {

                        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                        await this.persistenceLayer!.write(fingerprint, docMeta);

                        await this.persistenceLayer!.delete({fingerprint, docInfo: docMeta.docInfo});

                        return this;

                    }

                    public async stop() {
                        await this.persistenceLayer!.stop();
                    }

                }

                const replicationTester0 = await new ReplicationTester().init();
                const replicationTester1 = await new ReplicationTester().init();

                await replicationTester0.setup();
                await replicationTester1.setup();

                await replicationTester1.write();

                assert.ok(replicationTester0.hasDocReplicationEvent, "replicationTester0 failed");
                assert.ok(!replicationTester1.hasDocReplicationEvent, "replicationTester1 failed");

                await replicationTester0.stop();
                await replicationTester1.stop();

            });


        });

        DatastoreTester.test(async () => firebaseDatastore, false);

    }).catch(err => console.error(err));

});
