/**
 * Keeps track of the overall sync state and allows for state transitions
 * including the ability to abort a sync.
 *
 */
import {SyncState} from './SyncState';
import {SyncTaskResult} from './SyncTask';
import {Optional} from 'polar-shared/src/util/ts/Optional';

export interface SyncProgress {

    /**
     * The completion percentage over the interval [0,100]
     */
    percentage: number;

    state: SyncState;

    /**
     * The error for the sync when the status is failed.
     */
    error?: Error;

    /**
     * An optional task result from the last task executed.
     */
    taskResult: Optional<SyncTaskResult>;

    // TODO: not sure if we should expose this.
    //
    // /**
    //  * A message to display to the user.  Probably the last annotation and/or
    //  * document synchronized.
    //  */
    // public readonly message: string = "";

}
