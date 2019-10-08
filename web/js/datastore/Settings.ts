import {DocRepoTableColumns} from "../../../apps/repository/js/doc_repo/DocRepoTableColumns";
import {DeckNameStrategy} from "../apps/sync/framework/anki/AnkiSyncEngine";

/**
 * User settings for the UI.
 */
export interface Settings {

    /**
     * When true, the user has opted out of tracking.
     */
    readonly disableTracking: boolean;

    readonly documentRepository: DocumentRepositorySettings;

    [key: string]: any;

}

export interface DocumentRepositorySettings {

    /**
     * Allows us to keep track of the columns that are enabled/disabled.
     */
    readonly columns?: DocRepoTableColumns;

}

export interface AnkiSettings {

    readonly deckNameStrategy: DeckNameStrategy;

}

export class DefaultSettings implements Settings {

    public readonly disableTracking: boolean = false;

    public readonly documentRepository: DocumentRepositorySettings = {};

    public readonly ankiSettings: AnkiSettings = {
        deckNameStrategy: 'per-document'
    };

}
