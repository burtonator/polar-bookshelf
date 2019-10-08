import {Optional} from 'polar-shared/src/util/ts/Optional';

/**
 * Execute a job and optionally return additional data about how this job
 * executed.
 */
export interface SyncTask {
    (): Promise<Optional<SyncTaskResult>>;
}

export interface SyncTaskResult {

    readonly message?: string;

    /**
     * True if this task has failed to sync.
     */
    readonly failed?: boolean;

}
