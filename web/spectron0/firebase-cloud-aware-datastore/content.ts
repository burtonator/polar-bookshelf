import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {Promises} from '../../js/util/Promises';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {CloudAwareDatastore} from '../../js/datastore/CloudAwareDatastore';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Files} from 'polar-shared/src/util/Files';
import {DefaultDatastoreMutation} from '../../js/datastore/DatastoreMutation';
import {DocInfo} from '../../js/metadata/DocInfo';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {Datastores} from '../../js/datastore/Datastores';
import {ASYNC_NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Logging} from '../../js/logger/Logging';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import waitForExpect from 'wait-for-expect';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Latch} from "polar-shared/src/util/Latch";

const TIMEOUT = 30000;

Logging.initForTesting();

mocha.setup('bdd');
mocha.timeout(TIMEOUT);

async function createDatastore() {

    const diskDatastore = new DiskDatastore();
    const firebaseDatastore = new FirebaseDatastore();

    await Promise.all([diskDatastore.init(), firebaseDatastore.init()]);

    const cloudAwareDatastore = new CloudAwareDatastore(diskDatastore, firebaseDatastore);

    cloudAwareDatastore.shutdownHook = async () => {

        await waitForExpect(async () => {

            console.log("Checking consistency...");

            const consistency = await Datastores.checkConsistency(diskDatastore, firebaseDatastore);

            if (! consistency.consistent) {
                console.log("Filesystems are NOT consistent: ", consistency.manifest0, consistency.manifest1);
            }

            assert.ok(consistency.consistent, "Datastores are not consistent");

        }, TIMEOUT);

    };

    return cloudAwareDatastore;
}

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        await PolarDataDir.useFreshDirectory('.test-firebase-cloud-aware-datastore');

        const fingerprint = "0x001";

        // FIXME: there's anotbher issue here and that involves the FIRST sync.
        //
        // we have to detect that there are files ON DISK and not in the cloud,
        // then transfer them to the cloud.  At that oint the user is sync'd
        // with the cloud.

        // FIXME: states that need to be handled in UI....
        //
        // - MERGE should be the ideal situation NOT transfer... this is easier
        //   to implement.


        describe('Cloud datastore tests', function() {

            beforeEach(async function() {

                try {

                    console.log("==== BEGIN beforeEach: ");

                    console.log("Removing files from: " + PolarDataDir.get());

                    await Files.removeDirectoryRecursivelyAsync(PolarDataDir.get()!);

                    console.log("Initializing firebase datastore...");

                    const firebaseDatastore = new FirebaseDatastore();
                    await firebaseDatastore.init();

                    console.log("Initializing firebase datastore...done");

                    console.log("Purging firebase datastore...");

                    await Datastores.purge(firebaseDatastore,
                                           purgeEvent => console.log("Purged: ", purgeEvent));

                    console.log("Purging firebase datastore...done");

                    await firebaseDatastore.stop();

                } catch (e) {
                    console.error("Caught exception in beforeEach: ", e);
                    throw e;
                } finally {
                    console.log("==== END beforeEach");
                }

            });

            type ConsistencyTestFunction = (persistenceLayer: PersistenceLayer,
                                            cloudAwareDatastore: CloudAwareDatastore) => Promise<void>;

            /**
             * This will init the cloud datastore, then wait for them to become
             * consistent, then we run the test function to verify that the
             * datastore is valid.
             */
            async function testForConsistency(testFunction: ConsistencyTestFunction = ASYNC_NULL_FUNCTION) {

                const cloudAwareDatastore = await createDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(cloudAwareDatastore);

                try {

                    await persistenceLayer.init();

                    await waitForExpect(async () => {

                        const consistency
                            = await Datastores.checkConsistency(cloudAwareDatastore.local,
                                                                cloudAwareDatastore.cloud);

                        assert.ok(consistency.consistent);

                    });

                    await testFunction(persistenceLayer, cloudAwareDatastore);

                } finally {
                    await persistenceLayer.stop();
                }

            }

            it("Test8: Sync with extra files in the local store", async function() {

                const datastore = new DiskDatastore();
                await datastore.init();

                await datastore.writeDocMeta(MockDocMetas.createMockDocMeta('0x0004'));
                await datastore.writeDocMeta(MockDocMetas.createMockDocMeta('0x0005'));
                await datastore.stop();

                await testForConsistency(async (persistenceLayer, cloudAwareDatastore) => {

                    for (const currentFingerprint of ['0x0004', '0x0005']) {
                        assert.ok(await cloudAwareDatastore.local.contains(currentFingerprint));
                        assert.ok(await cloudAwareDatastore.cloud.contains(currentFingerprint));
                    }

                });

            });

            it("Test9: Sync with extra files in the firebase store", async function() {

                const datastore = new FirebaseDatastore();
                await datastore.init();

                await datastore.writeDocMeta(MockDocMetas.createMockDocMeta('0x0004'));
                await datastore.writeDocMeta(MockDocMetas.createMockDocMeta('0x0005'));
                await datastore.stop();

                await testForConsistency(async (persistenceLayer, cloudAwareDatastore) => {

                    for (const currentFingerprint of ['0x0004', '0x0005']) {
                        assert.ok(await cloudAwareDatastore.local.contains(currentFingerprint));
                        assert.ok(await cloudAwareDatastore.cloud.contains(currentFingerprint));
                    }

                });

            });

            it("Test1: null test to make sure we have no documents on startup", async function() {

                const persistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await persistenceLayer.init();

                const docMetaFiles = await persistenceLayer.getDocMetaRefs();
                assert.equal(docMetaFiles.length, 0);

                await persistenceLayer.stop();

            });

            it("Test2: Basic synchronization tests", async function() {

                // first purge the firebase datastore

                const firebaseDatastore = new FirebaseDatastore();

                await firebaseDatastore.init();

                await Datastores.purge(firebaseDatastore);

                // then write an initial doc to it...

                const firestorePersistenceLayer = new DefaultPersistenceLayer(firebaseDatastore);

                await firestorePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x001'));

                // now startup a new cloud persistence layer and make sure we
                // get the doc in firebase written locally.

                const cloudAwareDatastore = await createDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(cloudAwareDatastore);

                const initialDocLatch = new Latch<boolean>();
                const externallyWrittenDocLatch = new Latch<boolean>();

                cloudAwareDatastore.addDocMetaSnapshotEventListener(async docMetaSnapshotEvent => {

                    for (const docMutation of docMetaSnapshotEvent.docMetaMutations) {

                        if (docMutation.fingerprint === '0x001') {
                            initialDocLatch.resolve(true);
                            continue;
                        }

                        if (docMutation.fingerprint === '0x002') {
                            externallyWrittenDocLatch.resolve(true);
                            continue;
                        }

                    }

                });

                await persistenceLayer.init();

                await initialDocLatch.get();

                await firestorePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x002'));

                await externallyWrittenDocLatch.get();

                await waitForExpect(async () => {
                    assert.ok(await persistenceLayer.contains('0x002'), "Does not contain second doc");
                });

                console.log("WORKED");

                await persistenceLayer.stop();
                await firestorePersistenceLayer.stop();

            });

            it("Test3: Write a basic doc with synchronization listener", async function() {

                const cloudAwareDatastore = await createDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(cloudAwareDatastore);

                const latch0 = new Latch<boolean>();
                const latch1 = new Latch<boolean>();

                cloudAwareDatastore.addSynchronizationEventListener(docMetaSnapshotEvent => {

                    if (docMetaSnapshotEvent.consistency !== 'committed' ) {
                        return;
                    }

                    for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                        if (docMetaMutation.fingerprint === '0x002') {
                            latch0.resolve(true);
                        }
                        if (docMetaMutation.fingerprint === '0x003') {
                            latch1.resolve(true);
                        }
                    }

                });

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createMockDocMeta('0x002');
                await persistenceLayer.writeDocMeta(docMeta);

                const firebasePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await firebasePersistenceLayer.init();
                await firebasePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x003'));

                await latch0.get();
                await latch1.get();

                await persistenceLayer.stop();
                await firebasePersistenceLayer.stop();

            });

            it("Test4: Write a basic doc", async function() {

                const persistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createMockDocMeta();

                const datastoreMutation = new DefaultDatastoreMutation<IDocInfo>();

                let writtenDuration: number = 0;
                let committedDuration: number = 0;

                const before = Date.now();

                datastoreMutation.written.get().then(() => writtenDuration = Date.now() - before);
                datastoreMutation.committed.get().then(() => committedDuration = Date.now() - before);

                await persistenceLayer.write(fingerprint, docMeta, {datastoreMutation});

                console.log(`writtenDuration: ${writtenDuration}, committedDuration: ${committedDuration}`);

                await persistenceLayer.stop();

            });

            it("Test5: Test an existing firebase store with existing data replicating to a new CloudDatastore.", async function() {

                let err: Error | undefined;

                const errorListener = (error: Error) => {
                    console.error("Got error:  ", err);
                    err = error;
                };

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init(errorListener);
                await sourcePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta(fingerprint));
                await sourcePersistenceLayer.stop();

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await targetPersistenceLayer.init(errorListener);

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, fingerprint, 'state.json');
                    assert.ok(await Files.existsAsync(path), "Path does not exist: " + path);
                });

                await targetPersistenceLayer.stop();

                // verify that we have received no errors.
                assert.ok(err === undefined, "Received an error: " + err);

            });

            it("Test6: Verify unsubscribe works.", async function() {

                await Files.removeDirectoryRecursivelyAsync(PolarDataDir.get()!);

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());
                await targetPersistenceLayer.init();

                await Datastores.purge(targetPersistenceLayer.datastore);

                const docMetaFiles = await targetPersistenceLayer.getDocMetaRefs();
                assert.equal(docMetaFiles.length, 0);

                let gotEventAfterUnsubscribe = false;
                let unsubscribed = false;

                const snapshotResult = await targetPersistenceLayer.snapshot(async event => {
                    console.log("GOT AN EVENT with consistency: " + event.consistency, event);

                    if (event.consistency !== 'committed') {
                        return;
                    }

                    if (! unsubscribed) {
                        return;
                    }

                    gotEventAfterUnsubscribe = true;

                });

                snapshotResult.unsubscribe!();
                unsubscribed = true;

                const sidePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sidePersistenceLayer.init();
                await sidePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta());
                await sidePersistenceLayer.stop();

                // TODO: unfortunately, we HAVE to sleep here because we're
                // waiting for any lagging events
                await Promises.waitFor(5000);

                assert.ok(gotEventAfterUnsubscribe === false, "Nope.. we still got the event");

            });


            // FIXME: this wont' work yet due to the snapshot issue.
            xit("Test7: Test a remote write and a local replication to disk", async function() {

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init();

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());
                await targetPersistenceLayer.init();

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                await sourcePersistenceLayer.write(fingerprint, docMeta);

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, '0x001', 'state.json');
                    assert.ok(await Files.existsAsync(path), 'Path for fingerprint never appeared');
                });

                await sourcePersistenceLayer.stop();
                await targetPersistenceLayer.stop();

            });

        });

        DatastoreTester.test(createDatastore, false);

    }).catch(err => console.error(err));

});


