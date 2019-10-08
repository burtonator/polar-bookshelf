import {AdvertisingPersistenceLayer} from './AdvertisingPersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {MemoryDatastore} from '../MemoryDatastore';
import {MockDocMetas} from '../../metadata/DocMetas';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {assertJSON} from '../../test/Assertions';
import {MockAdvertisingPersistenceLayer} from './MockAdvertisingPersistenceLayer';
import {TestingTime} from '../../test/TestingTime';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

describe('AdvertisingPersistenceLayer', function() {

    it("addEventListenerForDoc", async function() {

        TestingTime.freeze();

        const defaultPersistenceLayer
            = new DefaultPersistenceLayer(new MemoryDatastore());

        const advertisingPersistenceLayer
            = new MockAdvertisingPersistenceLayer(defaultPersistenceLayer);

        const docMeta0 = MockDocMetas.createWithinInitialPagemarks('0x001', 1);
        const docMeta1 = MockDocMetas.createWithinInitialPagemarks('0x002', 1);

        const advertised: IDocInfo[] = [];

        await advertisingPersistenceLayer.init();

        advertisingPersistenceLayer.addEventListenerForDoc('0x001', event => {
            advertised.push(event.docInfo);
        });

        await advertisingPersistenceLayer.writeDocMeta(docMeta0);
        await advertisingPersistenceLayer.writeDocMeta(docMeta1);

        advertised[0].uuid = '...';

        const expected: IDocInfo[] = [
            <IDocInfo> {
                "progress": 100,
                "pagemarkType": "SINGLE_COLUMN",
                "properties": {},
                "readingPerDay": {
                    "2012-03-02": 1
                },
                "archived": false,
                "flagged": false,
                "tags": {},
                "nrPages": 1,
                "fingerprint": "0x001",
                "added": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "nrComments": 0,
                "nrNotes": 0,
                "nrFlashcards": 0,
                "nrTextHighlights": 0,
                "nrAreaHighlights": 0,
                "uuid": "...",
                "nrAnnotations": 0,
                attachments: {}
            }
        ];

        assertJSON(Dictionaries.sorted(advertised), Dictionaries.sorted(expected));

    });

});
