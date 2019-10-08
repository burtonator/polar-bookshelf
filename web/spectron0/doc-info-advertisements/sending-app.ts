import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {assertJSON} from '../../js/test/Assertions';
import {TestingTime} from '../../js/test/TestingTime';
import {canonicalize} from './testing';

const log = Logger.create();

TestingTime.freeze();

SpectronRenderer.run(async () => {

    log.info("Sending advertisement now.");

    const docMeta = MockDocMetas.createWithinInitialPagemarks('0x0001', 1);

    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(persistenceLayer);

    await advertisingPersistenceLayer.init();

    const expected = {
        "progress": 100,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "tags": {},
        "archived": false,
        "flagged": false,
        "nrPages": 1,
        "fingerprint": "0x0001",
        "added": "2012-03-02T11:38:49.321Z",
        "readingPerDay": {
            "2012-03-02": 1
        },
        attachments: {}}

    ;

    assertJSON(canonicalize(docMeta.docInfo), canonicalize(expected));

    await advertisingPersistenceLayer.writeDocMeta(docMeta);

    console.log("Sender SUCCESSFUL");

});
