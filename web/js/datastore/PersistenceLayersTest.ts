import {assert} from "chai";
import {FirebaseDatastore} from './FirebaseDatastore';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DiskDatastore} from './DiskDatastore';
import {Datastores} from './Datastores';
import {PersistenceLayers} from './PersistenceLayers';
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';
import {PersistenceLayer} from './PersistenceLayer';
import {UUIDs} from "../metadata/UUIDs";
import {TestingTime} from "../test/TestingTime";

describe('PersistenceLayers', function() {

    const fingerprint = "0x001";
    const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

    let source: PersistenceLayer;
    let target: PersistenceLayer;

    beforeEach(async function() {
        TestingTime.freeze();
        source = new DefaultPersistenceLayer(new MemoryDatastore());
        target = new DefaultPersistenceLayer(new MemoryDatastore());
        await Promise.all([source.init(), target.init()]);
    });

    afterEach(async function() {
        await Promise.all([source.stop(), target.stop()]);
        TestingTime.unfreeze();
    });

    xit("Transfer with existing in source but not in target", async function() {

        await source.write(fingerprint, docMeta);

        // const transferResult = await PersistenceLayers.synchronize(source, target, (transferEvent) => {
        //     console.log("Transfer event: ", transferEvent);
        // });

        // assert.equal(transferResult.mutations.fingerprints.length, 1);

    });

    xit("Transfer with existing in source and target", async function() {
        //
        // await target.write(fingerprint, docMeta);
        //
        // TestingTime.forward(1000);
        //
        // // write a newer one to the source...
        // docMeta.docInfo.uuid = UUIDs.create();
        //
        // await source.write(fingerprint, docMeta);
        //
        // const transferResult = await PersistenceLayers.synchronize(source, target, (transferEvent) => {
        //     console.log("Transfer event: ", transferEvent);
        // });
        //
        // assert.equal(transferResult.mutations.fingerprints.length, 1);

    });

});
