import {DecksSync} from './DecksSync';
import {DeckDescriptor} from './DeckDescriptor';
import {assertJSON} from '../../../../test/Assertions';
import {DeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {CreateDeckClient} from './clients/CreateDeckClient';
import {Abortable} from '../Abortable';
import {SyncProgressListener} from '../SyncProgressListener';
import {SyncProgress} from '../SyncProgress';
import {SyncQueue} from '../SyncQueue';


describe('DecksSync', function() {

    let decksSync: DecksSync;

    let abortable: Abortable;

    let syncProgress: SyncProgress | undefined;

    const syncProgressListener: SyncProgressListener = _syncProgress => {
        console.log(_syncProgress);
        syncProgress = _syncProgress;
    };

    let syncQueue: SyncQueue;

    beforeEach(function() {

        abortable = {
            aborted: false
        };

        syncQueue = new SyncQueue(abortable, syncProgressListener);

        decksSync = new DecksSync(syncQueue);

        decksSync.createDeckClient = CreateDeckClient.createMock(1);
        decksSync.deckNamesAndIdsClient = DeckNamesAndIdsClient.createMock({});

    });

    it("basic sync", async function() {

        const deckDescriptors: DeckDescriptor[] = [
            {
                name: "Test Deck"
            }
        ];

        const createdDescriptors = decksSync.enqueue(deckDescriptors);

        await syncQueue.execute();

        assertJSON(createdDescriptors, [
            {
                "name": "Test Deck"
            }
        ]);

        assertJSON(syncProgress, {
            "percentage": 100,
            "state": "COMPLETED",
            "taskResult": {
                "value": {
                    "message": "Creating missing deck: Test Deck"
                }
            }
        });

    });

});
