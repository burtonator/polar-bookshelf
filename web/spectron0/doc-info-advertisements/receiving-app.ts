import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';
import {assertJSON} from '../../js/test/Assertions';
import {canonicalize} from './testing';

const log = Logger.create();

SpectronRenderer.run(async (state) => {

    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(persistenceLayer);

    await advertisingPersistenceLayer.init();

    advertisingPersistenceLayer.addEventListener(adv => {

        console.log("Got the advertisement: ", adv);

        const expected = {
            "added": "2012-03-02T11:38:49.321Z",
            "archived": false,
            "fingerprint": "0x0001",
            "flagged": false,
            "lastUpdated": "2012-03-02T11:38:49.321Z",
            "nrAnnotations": 0,
            "nrAreaHighlights": 0,
            "nrComments": 0,
            "nrFlashcards": 0,
            "nrNotes": 0,
            "nrPages": 1,
            "nrTextHighlights": 0,
            "pagemarkType": "SINGLE_COLUMN",
            "progress": 100,
            "properties": {},
            "tags": {},
            "uuid": "4743a590-645c-11e1-809e-478d48422a2c",
            "readingPerDay": {
                "2012-03-02": 1
            },
            "attachments": {}

        };

        assertJSON(canonicalize(adv.docInfo), canonicalize(expected));

        console.log("Receiver SUCCESSFUL");

        state.testResultWriter.write(true)
            .then(() => log.info("DONE"))
            .catch((err: Error) => {
                log.error("Could not receive event.", err);
            });

    });

});
