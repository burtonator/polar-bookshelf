import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob, StartedSyncJob} from '../SyncJob';
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {DecksSync} from './DecksSync';
import {SyncQueue} from '../SyncQueue';
import {NotesSync} from './NotesSync';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

abstract class AnkiSyncJob {

    protected readonly syncProgressListener: SyncProgressListener;
    protected readonly deckDescriptors: DeckDescriptor[];
    protected readonly noteDescriptors: NoteDescriptor[];

    public constructor(syncProgressListener: SyncProgressListener,
                       deckDescriptors: DeckDescriptor[],
                       noteDescriptors: NoteDescriptor[]) {

        this.syncProgressListener = syncProgressListener;
        this.deckDescriptors = deckDescriptors;
        this.noteDescriptors = noteDescriptors;

    }

}

export class PendingAnkiSyncJob extends AnkiSyncJob implements PendingSyncJob {

    public async start(): Promise<StartedSyncJob> {

        const startedAnkiSyncJob = new StartedAnkiSyncJob(this.syncProgressListener,
                                                          this.deckDescriptors,
                                                          this.noteDescriptors);
        return startedAnkiSyncJob.run();

    }

}

export class StartedAnkiSyncJob extends AnkiSyncJob implements StartedSyncJob {

    public aborted = false;

    public abort(): void {
        this.aborted = true;
    }

    public async run(): Promise<this> {

        const syncQueue = new SyncQueue(this, this.syncProgressListener);

        const decksSync = new DecksSync(syncQueue);

        log.info("Starting anki sync job with deckDescriptors: ", this.deckDescriptors)

        decksSync.enqueue(this.deckDescriptors);

        const notesSync = new NotesSync(syncQueue);

        notesSync.enqueue(this.noteDescriptors);

        await syncQueue.execute();

        return this;

    }

}
