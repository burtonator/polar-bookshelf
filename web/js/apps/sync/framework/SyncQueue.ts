import {SyncProgressListener} from './SyncProgressListener';
import {Abortable} from './Abortable';
import {SyncProgress} from './SyncProgress';
import {SyncState} from './SyncState';
import {SyncTask} from './SyncTask';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Percentages} from '../../../util/Percentages';
import {Optional} from 'polar-shared/src/util/ts/Optional';

const log = Logger.create();

/**
 * A queue that supports adding tasks and executing/draining draining all tasks.
 *
 * The queue can be expanded by adding more tasks.  Generally the idea is that
 * the user performs various steps and between each step it drains the queue by
 * executing all tasks.
 */
export class SyncQueue {

    private readonly pending: SyncTask[] = [];

    /**
     * The total number of tasks that have been submitted.
     */
    private total = 0;

    private readonly abortable: Abortable;

    private readonly syncProgressListener: SyncProgressListener;

    private readonly syncProgress: SyncProgress = {
        percentage: 0,
        state: SyncState.STARTED,
        error: undefined,
        taskResult: Optional.empty()
    };

    /**
     *
     * @param abortable The abortable service running the sync. When aborted is
     * true we need to stop the sync.
     *
     * @param syncProgressListener A callback for the state while we're
     *     executing.
     */
    constructor(abortable: Abortable, syncProgressListener: SyncProgressListener) {
        this.abortable = abortable;
        this.syncProgressListener = syncProgressListener;
    }

    /**
     * Add tasks that need executing.
     */
    public add(...task: SyncTask[]) {
        this.pending.push(...task);
        ++this.total;
    }

    /**
     * Execute all tasks in the queue.
     */
    public async execute() {

        let syncTask: SyncTask | undefined;

        let idx = 0;

        // noinspection TsLint
        while ((syncTask = this.pending.shift()) !== undefined) {

            if (this.abortable.aborted) {
                log.info("Aborting sync.");
                return;
            }

            try {

                this.syncProgress.taskResult = await syncTask();

            } catch (e) {

                this.syncProgress.error = e;
                this.syncProgress.state = SyncState.FAILED;

                this.fireSyncProgress();

                break;
            }

            ++idx;
            this.syncProgress.percentage = Percentages.calculate(idx, this.total);

            this.fireSyncProgress();

        }

    }

    public size() {
        return this.pending.length;
    }

    private fireSyncProgress() {

        if (this.syncProgress.percentage === 100) {
            this.syncProgress.state = SyncState.COMPLETED;
        }

        this.syncProgressListener(Object.freeze(Object.assign({}, this.syncProgress)));

    }

}
