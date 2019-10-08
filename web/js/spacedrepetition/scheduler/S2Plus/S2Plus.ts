import {Dates} from './Dates';
import {Days} from './Dates';

const GRADE_MIN = 0;
const GRADE_MAX = 1;
const GRADE_CUTOFF = 0.6;
export const DEFAULT_DIFFICULTY = 0.3;

export const DEFAULT_INTERVAL = 1;

/**
 * TODO
 *  - What is 'difficulty' and why do we need to have it per iteration...
 *
 *  - What do we use to prioritize the next round of training?  it has to be a
 *    queue but how do I sort the queue?
 *  -
 */

/**
 * https://github.com/pensieve-srs/pensieve-srs
 * http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
 */
export class S2Plus {

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static calcRecallRate(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const recall = 2 ** (-diff / interval);
        return Math.ceil(recall * 100) / 100;
    }

    public static calcPercentOverdue(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const calculated = diff / interval;
        return Math.min(2, calculated);
    }

    /**
     *
     *
     * @param reviewedAt The time the value was last reviews.  For new cards
     *                   use the current time and the set an 'interval' to the
     *                   default interval which is probably 1 day.
     *
     * @param prevDifficulty
     *
     * @param prevInterval
     *
     * @param performanceRating After an item is attempted, choose a
     * performanceRating from [0.0, 1.0], with 1.0 being the best.  Set a cutoff
     * point for the answer being “correct” (default is 0.6). Then set
     *
     * @param timestamp The time the calculation was done.
     */
    public static calculate(reviewedAt: Date,
                            prevDifficulty: Difficulty,
                            prevInterval: Days,
                            performanceRating: number,
                            timestamp = new Date()): Scheduling {

        const percentOverdue = this.calcPercentOverdue(reviewedAt, prevInterval, timestamp);

        const difficultyDelta = percentOverdue * (1 / 17) * (8 - 9 * performanceRating);
        const difficulty = this.clamp(prevDifficulty + difficultyDelta, 0, 1);

        const difficultyWeight = 3 - 1.7 * difficulty;

        let intervalDelta;
        if (performanceRating < GRADE_CUTOFF) {
            intervalDelta = Math.round(1 / difficultyWeight ** 2) || 1;
        } else {
            intervalDelta = 1 + Math.round((difficultyWeight - 1) * percentOverdue);
        }

        const interval = prevInterval * intervalDelta;

        const nextReviewDate = Dates.addDays(timestamp, interval);

        return {
            difficulty,
            interval,
            nextReviewDate,
            reviewedAt: timestamp,
        };

    }

}

export interface Scheduling {
    readonly difficulty: Difficulty;
    readonly interval: Days;
    readonly nextReviewDate: Date;
    readonly reviewedAt: Date;
}

/**
 * How difficult the item is, from [0.0, 1.0].  Defaults to 0.3 (if the software
 * has no way of determining a better default for an item)
 */
export type Difficulty = number;

