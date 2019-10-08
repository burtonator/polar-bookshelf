/**
 * Code that synchronizes decks by creating new decks when the required decks
 * are missing.
 */
import {DeckDescriptor} from './DeckDescriptor';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {CreateDeckClient, ICreateDeckClient} from './clients/CreateDeckClient';
import {DeckNamesAndIdsClient, IDeckNamesAndIdsClient} from './clients/DeckNamesAndIdsClient';
import {SyncProgressListener} from '../SyncProgressListener';
import {Abortable} from '../Abortable';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SyncQueue} from '../SyncQueue';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {SyncTaskResult} from '../SyncTask';
import {NormalizedNote} from './NotesSync';

const log = Logger.create();

/**
 * Sync decks to Anki.
 */
export class DecksSync {

    public createDeckClient: ICreateDeckClient = new CreateDeckClient();

    public deckNamesAndIdsClient: IDeckNamesAndIdsClient = new DeckNamesAndIdsClient();

    private readonly missingDecks: string[] = [];

    private readonly missingDeckDescriptors: DeckDescriptor[] = [];

    private readonly syncQueue: SyncQueue;

    /**
     *
     * @param syncQueue The queue to use for async operations.
     *
     */
    constructor(syncQueue: SyncQueue) {
        this.syncQueue = syncQueue;
    }

    /**
     * Make sure all decks are properly setup in Anki.
     *
     * @param deckDescriptors The decks we need created.
     *
     */
    public enqueue(deckDescriptors: DeckDescriptor[]) {

        this.syncQueue.add(async () => {
            return await this.findExistingDecks(deckDescriptors);
        });

        this.syncQueue.add(async () => {
            return await this.createMissingDecks();
        });

        return this.missingDeckDescriptors;

    }

    private async findExistingDecks(deckDescriptors: DeckDescriptor[]): Promise<Optional<SyncTaskResult>> {

        log.info("Fetching existing decks for deckDescriptors: ", deckDescriptors);

        const deckNamesAndIds = await this.deckNamesAndIdsClient.execute();

        // now I just need to compute the set difference deckDescriptors / deckNamesAndIds
        // for all decks that are not in deckNamesAndIds

        const currentDecks: string[] = Object.keys(deckNamesAndIds);
        const expectedDecks = deckDescriptors.map(current => current.name);

        this.missingDecks.push(... SetArrays.difference(expectedDecks, currentDecks));

        const message = `Found ${this.missingDecks.length} missing decks from a total of ${currentDecks.length}`;
        log.info(message);

        this.missingDeckDescriptors.push(... this.missingDecks.map(name => <DeckDescriptor> { name }));

        return Optional.of({message});

    }

    private async createMissingDecks(): Promise<Optional<SyncTaskResult>> {

        this.missingDecks.forEach(missingDeck => {
            this.syncQueue.add(async () => {
                return await this.createMissingDeck(missingDeck);
            });
        });

        const message = `Creating ${this.missingDecks.length} decks.`;

        return Optional.of({message});

    }

    private async createMissingDeck(missingDeck: string): Promise<Optional<SyncTaskResult>> {
        const message = `Creating missing deck: ${missingDeck}`;
        log.info(message);
        await this.createDeckClient.execute(missingDeck);
        return Optional.of({message});
    }

}
