import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import {MockDocMetas} from '../metadata/DocMetas';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {isPresent} from 'polar-shared/src/Preconditions';

import os from 'os';
import {Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Directories, GlobalDataDir} from './Directories';
import {MockPHZWriter} from '../phz/MockPHZWriter';
import {DocMetaFileRef} from './DocMetaRef';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {Datastore} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';
import {DefaultDatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {DiskDatastore} from './DiskDatastore';
import {TestingTime} from '../test/TestingTime';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Latch} from "polar-shared/src/util/Latch";

const tmpdir = os.tmpdir();

export class DatastoreTester {

    public static test(datastoreFactory: () => Promise<Datastore>, hasLocalFiles: boolean = true) {

        describe('DatastoreTester tests', function() {

            const fingerprint = "0x001";

            const dataDir = FilePaths.join(tmpdir, 'test-data-dir');

            let datastore: Datastore;
            let persistenceLayer: DefaultPersistenceLayer;

            let docMeta: IDocMeta;

            let directories: Directories;

            beforeEach(async function() {

                try {

                    console.log("===== before test ====");

                    console.log("Removing directory recursively: " + dataDir);

                    await Files.removeDirectoryRecursivelyAsync(dataDir);

                    GlobalDataDir.set(dataDir);
                    console.log("Creating new datastore");

                    datastore = await datastoreFactory();
                    directories = new Directories();

                    persistenceLayer = new DefaultPersistenceLayer(datastore);

                    console.log("Init of new persistence layer...");
                    await persistenceLayer.init();
                    console.log("Init of new persistence layer...done");

                    console.log("Purge of new persistence layer...");
                    await Datastores.purge(datastore, purgeEvent => console.log("Purged: ", purgeEvent));
                    console.log("Purge of new persistence layer...done");

                    docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                    docMeta.docInfo.filename = `${fingerprint}.phz`;

                    await persistenceLayer.delete({ fingerprint, docInfo: docMeta.docInfo });

                    const contains = await persistenceLayer.contains(fingerprint);

                    assert.equal(contains, false, "Document already exists in persistence layer: " + fingerprint);

                    await Files.createDirAsync(directories.dataDir);
                    await Files.createDirAsync(directories.stashDir);

                    await MockPHZWriter.write(FilePaths.create(directories.stashDir, `${fingerprint}.phz`));

                    const datastoreMutation = new DefaultDatastoreMutation<IDocInfo>();

                    await persistenceLayer.write(fingerprint, docMeta, { datastoreMutation });

                    // make sure we're always using the datastore mutations
                    await datastoreMutation.written.get();

                    // TODO: I think this is acceptable as our consistency is
                    // local first.
                    await datastoreMutation.committed.get();

                } catch (e) {
                    console.error("beforeEach failed: ", e);
                    throw e;
                }

            });

            afterEach(async function() {

                try {

                    console.log("===== after test ====");

                    await Datastores.purge(persistenceLayer.datastore,
                                           purgeEvent => console.log("Purged: ", purgeEvent));

                    await persistenceLayer.stop();

                } catch (e) {
                    console.error("afterEach failed: ", e);
                    throw e;
                }

            });

            it("write and read data to disk", async function() {

                // let contains = await persistenceLayer.contains(fingerprint);
                //
                // assert.ok(! contains);

                const docMeta0 = await persistenceLayer.getDocMeta(fingerprint);

                assert.ok(docMeta0!.docInfo.lastUpdated !== undefined);

                delete docMeta0!.docInfo.lastUpdated;
                delete docMeta0!.docInfo.nrComments;
                delete docMeta0!.docInfo.nrFlashcards;
                delete docMeta0!.docInfo.nrAreaHighlights;
                delete docMeta0!.docInfo.nrTextHighlights;
                delete docMeta0!.docInfo.nrNotes;
                delete docMeta0!.docInfo.nrAnnotations;
                delete docMeta0!.docInfo.uuid;

                docMeta!.docInfo.uuid = '__canonicalized__';
                docMeta0!.docInfo.uuid = '__canonicalized__';

                assert.equal(isPresent(docMeta0), true, "docMeta0 is not present");

                assertJSON(Dictionaries.sorted(docMeta), Dictionaries.sorted(docMeta0));

            });



            it("data contains no whitespace", async function() {

                const data = await datastore.getDocMeta(fingerprint);

                assert.isNotNull(data);
                assert.equal(data!.indexOf("\n"), -1);

            });


            it("read non-existant fingerprint", async function() {

                const nonExistantDocMeta = await persistenceLayer.getDocMeta('0x666');

                assert.ok(nonExistantDocMeta === undefined);

            });

            it("Delete DocMeta and the associated stash file...", async function() {

                const docMetaFileRef: DocMetaFileRef = {
                    fingerprint,
                    docFile: {
                        name: `${fingerprint}.phz`
                    },
                    docInfo: docMeta.docInfo
                };

                // make sure the files exist on disk...

                const docPath = FilePaths.join(directories.stashDir, `${fingerprint}.phz`);
                const statePath = FilePaths.join(directories.dataDir, fingerprint, 'state.json');

                if (hasLocalFiles) {
                    assert.ok(await Files.existsAsync(docPath));
                    assert.ok(await Files.existsAsync(statePath));

                }

                await persistenceLayer.delete(docMetaFileRef);

                if (hasLocalFiles) {

                    // make sure the files were deleted

                    assert.ok(! await Files.existsAsync(docPath));
                    assert.ok(! await Files.existsAsync(statePath));

                }

                // perform the delete multiple times now to make sure we're
                // idempotent for deletes
                await persistenceLayer.delete(docMetaFileRef);
                await persistenceLayer.delete(docMetaFileRef);
                await persistenceLayer.delete(docMetaFileRef);

            });

            it("adding binary files", async function() {

                const data = 'fake image data';
                const fileRef = {name: 'test.jpg'};

                await datastore.deleteFile(Backend.IMAGE, fileRef);
                await datastore.deleteFile(Backend.IMAGE, fileRef);

                assert.ok(! await datastore.containsFile(Backend.IMAGE, fileRef), "Datastore already contains file!");

                const meta = {
                    "foo": "bar"
                };

                await datastore.writeFile(Backend.IMAGE, fileRef, data, {meta});
                await datastore.writeFile(Backend.IMAGE, fileRef, data, {meta});

                assert.ok(await datastore.containsFile(Backend.IMAGE, fileRef));

                const datastoreFile = datastore.getFile(Backend.IMAGE, fileRef);
                assert.ok(datastoreFile, "no result");

                // noinspection TsLint
                // assert.equal(datastoreFile.get().meta['foo'], 'bar');

                // assertJSON(datastoreFile.get().meta, meta, "meta values
                // differ");

                await datastore.deleteFile(Backend.IMAGE, fileRef);
                // make sure we're idempotent for our writes.
                await datastore.deleteFile(Backend.IMAGE, fileRef);

            });

            it("getDocMetaFiles", async function() {

                const docMetaFiles = await datastore.getDocMetaRefs();

                assert.equal(docMetaFiles.length > 0, true);

                assert.equal(docMetaFiles.map((current) => current.fingerprint).includes(fingerprint), true);

            });

            it("overview", async function() {

                // right now just make sure we can call it and that the value
                // it returns is is not undefined.
                const overview = await datastore.overview();
                assert.isDefined(overview);

            });

            it("snapshot and make sure we receive a terminated batch at committed consistency.", async function() {

                const writtenSnapshotReceived = new Latch<boolean>();
                const committedSnapshotReceived = new Latch<boolean>();

                const snapshotResult = await datastore.snapshot(async docMetaSnapshotEvent => {

                    if (docMetaSnapshotEvent.batch) {

                        if (docMetaSnapshotEvent.batch.terminated) {

                            if ( docMetaSnapshotEvent.consistency === 'committed') {
                                committedSnapshotReceived.resolve(true);
                                // if we have received the committed we also
                                // received the written.
                                writtenSnapshotReceived.resolve(true);
                            }

                            if ( docMetaSnapshotEvent.consistency === 'written') {
                                writtenSnapshotReceived.resolve(true);
                            }

                        }
                    }

                });

                await writtenSnapshotReceived.get();
                await committedSnapshotReceived.get();

                if (snapshotResult.unsubscribe) {
                    // unsubscribe to the snapshot if necessary
                    snapshotResult.unsubscribe();
                }

            });


            it("createBackup", async function() {

                if (! (datastore instanceof DiskDatastore)) {
                    console.log("Skipping (not DiskDatastore)");
                    return;
                }

                try {

                    TestingTime.freeze();

                    const now = new Date();

                    // Fri, 02 Mar 2012 11:38:49 GMT
                    console.log("Creating backup at: " + now.toUTCString());

                    const backupDir = FilePaths.join(dataDir, ".backup-2012-03-02");

                    await datastore.createBackup();

                    console.log("Testing for backup dir: " + backupDir);

                    assert.ok(await Files.existsAsync(backupDir));

                    assert.ok(! await Files.existsAsync(FilePaths.join(backupDir, ".backup-2012-03-02")));

                    const statePath = FilePaths.join(backupDir, '0x001', 'state.json');
                    assert.ok(await Files.existsAsync(statePath));

                } finally {

                    TestingTime.unfreeze();

                }


            });

        });

    }

}
