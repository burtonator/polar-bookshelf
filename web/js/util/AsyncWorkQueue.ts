import {Logger} from 'polar-shared/src/logger/Logger';
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

/**
 * A work queue that contains a list of async functions which are just
 * executed.
 *
 * The queue can be appended too and is continually executed until it's
 * exhausted and the last task is finished.
 *
 * This isn't designed to scale CPU as the tasks are all executing in a single
 * thread but is more focused on executing code in parallel that is using some
 * remote resource.  This is great for code that is using async IO so we can
 * multiplex.
 *
 */
export class AsyncWorkQueue {

    public readonly concurrency: number;

    private readonly work: AsyncFunction[];

    private readonly completion: Latch<boolean> = new Latch();

    /**
     * The total number of currently executing tasks.
     */
    private executing: number = 0;

    /**
     * The total number of completed tasks.
     */
    private completed: number = 0;

    private terminated: boolean = false;

    constructor(work: Array<AsyncFunction>, concurrency: number = 25) {
        this.concurrency = concurrency;
        // TODO: I don't like sharing the same array but creating a copy seems to break tests
        // for some reasons and not sure why just yet.
        this.work = work;
    }

    public execute(): Promise<boolean> {

        this.handleTaskCreation();

        return this.completion.get();

    }

    /**
     * Allows us to enqueue more work in this AsyncWorkQueue but we can depend
     * on the result without starting the task.
     */
    public enqueue<T>(asyncTask: TypedAsyncFunction<T> ): Latch<T> {

        const latch: Latch<T> = new Latch();

        const wrapperTask = async () => {

            const result = await asyncTask();
            latch.resolve(result);

        };

        this.work.push(wrapperTask);

        return latch;

    }

    /**
     * Return the total number of executing tasks.
     */
    public getExecuting() {
        return this.executing;
    }

    public getCompleted() {
        return this.completed;
    }

    private handleTaskCreation() {

        const newTaskCount = this.concurrency - this.executing;

        for (let idx = 0; idx < newTaskCount; ++idx) {

            // each time we enter handleTaskCreation we need to determine if we
            // need to create more than one task because near shutdown it's
            // possible for the last task to re-enque N jobs which will all
            // need to be processed at once.

            const task = this.work.shift();

            if (! task) {
                break;
            }

            ++this.executing;

            task()
                .then(() => {
                    this.handleNextTask();
                })
                .catch(err => {
                    log.error("Unable to handle task: ", err);
                    // your code should do its own error handling....
                    this.handleNextTask();
                });

        }

        if (this.work.length === 0 && this.executing === 0) {

            // terminate if we are the last executing task AND there is no more
            // work.

            if (!this.terminated) {
                this.completion.resolve(true);
                this.terminated = true;
            }

            return;

        }

    }

    private handleNextTask() {
        ++this.completed;
        --this.executing;
        this.handleTaskCreation();
    }

}

export type AsyncFunction = () => Promise<any>;

export type TypedAsyncFunction<T> = () => Promise<T>;
