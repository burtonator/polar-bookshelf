/**
 * Represents the progress of a state of tasks and allows us to just incr()
 * the progress in a loop rather than having the math exposed in the loop.
 *
 * @Deprecated use ProgressTracker
 */
export class ProgressCalculator {

    // noinspection TsLint
    private _value: number = 0;

    // noinspection TsLint
    private readonly _total: number;

    /**
     *
     * @param total
     * @param initial The initial value of the progress counter.
     */
    constructor(total: number, initial: number = 0) {
        this._value = initial;
        this._total = total;
    }

    public incr() {
        ++this._value;
    }

    public value() {
        return this._value;
    }

    public total() {
        return this._total;
    }

    public percentage(): number {

        if (this._total === 0) {
            return 100;
        }

        return 100 * (this._value / this._total);
    }

    public static calculate(count: number, total: number, defaultValue: number = 0) {

        if (total === 0) {
            return defaultValue;
        }

        return 100 * (count / total);
    }

}
