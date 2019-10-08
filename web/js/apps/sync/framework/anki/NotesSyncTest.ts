import {assertJSON} from '../../../../test/Assertions';
import {NotesSync} from './NotesSync';
import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient} from './clients/FindNotesClient';
import {Abortable} from '../Abortable';
import {SyncProgress} from '../SyncProgress';
import {SyncProgressListener} from '../SyncProgressListener';
import {SyncQueue} from '../SyncQueue';
import {StoreMediaFileClient} from './clients/StoreMediaFileClient';
import {CanAddNotesClient} from './clients/CanAddNotesClient';

describe('NotesSync', function() {

    let notesSync: NotesSync;

    let abortable: Abortable;

    let syncProgress: SyncProgress | undefined;

    const syncProgressListener: SyncProgressListener = _syncProgress => {
        console.log(syncProgress);
        syncProgress = _syncProgress;
    };

    let syncQueue: SyncQueue;

    beforeEach(function() {

        abortable = {
            aborted: false
        };

        syncQueue = new SyncQueue(abortable, syncProgressListener);

        notesSync = new NotesSync(syncQueue);

    });

    it("full initial sync", async function() {

        // ****
        // create mocks where we have no initial notes, and we allow
        // a new note to be created.
        notesSync.addNoteClient = AddNoteClient.createMock(1);
        notesSync.canAddNotesClient = CanAddNotesClient.createMock([true]);
        notesSync.storeMediaFileClient = StoreMediaFileClient.createMock();
        notesSync.findNotesClient = FindNotesClient.createMock([]);

        const noteDescriptors: NoteDescriptor[] = [
            {
                guid: "101",
                deckName: "test",
                modelName: "test",
                fields: {},
                tags: []
            }
        ];

        const notesSynchronized = notesSync.enqueue(noteDescriptors);

        await syncQueue.execute();

        assertJSON(notesSynchronized.created, noteDescriptors);

    });

    it("sync with pre-existing notes that are skipped", async function() {

        // ****
        // create mocks where we have no initial notes, and we allow
        // a new note to be created.
        notesSync.addNoteClient = AddNoteClient.createMock(1);
        notesSync.findNotesClient = FindNotesClient.createMock([1]);

        const noteDescriptors: NoteDescriptor[] = [
            {
                guid: "101",
                deckName: "test",
                modelName: "test",
                fields: {},
                tags: []
            }
        ];

        const notesSynchronized = notesSync.enqueue(noteDescriptors);

        await syncQueue.execute();

        assertJSON(notesSynchronized.created, []);

    });

});
