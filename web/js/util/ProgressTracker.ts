import {Percentages} from "./Percentages";

let NONCE = 0;

/**
 * Represents the progress of a state of tasks and allows us to just incr()
 * the progress in a loop rather than having the math exposed in the loop.
 */
export class ProgressTracker {

    private state: MutableProgress;

    private readonly epoch: number;

    constructor(total: number, id: string) {

        this.epoch = Date.now();

        this.state = {
            task: NONCE++,
            id,
            completed: 0,
            total,
            duration: 0,
            progress: 0,
            timestamp: Date.now()
        };

        if (this.state.total === 0) {
            // we're done when there aree no tasks.
            this.state.progress = 100;
        }

    }

    /**
     * Progress as an absolute value.  Used for counters like received bytes
     * that aren't deltas but are absolute values.
     *
     */
    public abs(value: number): Progress {

        const now = Date.now();

        this.state.completed = value;
        this.state.progress = this.calculate();
        this.state.duration = now - this.epoch;
        return this.peek();
    }

    /**
     * Increment the progress of the job by one, compute the updated state,
     * and return.
     */
    public incr(value: number = 1): Progress {
        return this.abs(this.state.completed + value);
    }

    /**
     * Used so that we can jump to the end the job as it's terminated.
     *
     */
    public terminate(): Progress {
        this.state.completed = this.state.total;
        this.state.progress = this.calculate();
        this.state.duration = Date.now() - this.epoch;
        return this.peek();
    }

    /**
     * Get a current view of the progress state.
     */
    public peek(): Progress {
        const result = {...this.state};
        result.timestamp = Date.now();
        return result;
    }

    private calculate(): Percentage {

        if (this.state.total === 0) {
            return 100;
        }

        const result = Percentages.calculate(this.state.completed, this.state.total);

        if (result < 0 || result > 100) {
            const msg = `Invalid percentage: ${result}: completed: ${this.state.completed} vs total: ${this.state.total}`;
            throw new Error(msg);
        }

        return <Percentage> result;

    }

    public static createNonce() {
        return NONCE++;
    }

}

export type ProgressListener = (progressState: Progress) => void;

export type UnixTimeMS = number;

export interface MutableProgress {
    task: TaskID;
    completed: number;
    total: number;
    duration: number;
    progress: Percentage;
    id: string;
    timestamp: UnixTimeMS;

    /**
     *  An optional human readable name for the task being completed.
     */
    name?: string;

}

export interface Progress extends Readonly<MutableProgress> {

}

export class ProgressStates {

    // public static calculate(completed: number, total: number, duration: number, id: string): Readonly<ProgressState> {
    //
    //     const progress = <Percentage> Percentages.calculate(completed, total);
    //
    //     return {task: 0, completed, total, duration, progress, id};
    //
    // }

}

/**
 * A unique task ID for the job using the ProgressTracker.
 */
export type TaskID = number;

/**
 * An actual percentage value between zero and 100 [0,100]
 */
export type Percentage = 0  |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 |
                         10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
                         20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
                         30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
                         40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 |
                         50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 |
                         60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 |
                         70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 |
                         80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 |
                         90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 |
                         100;

