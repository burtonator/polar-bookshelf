import {Stopwatch} from './Stopwatch';

export class Stopwatches {

    public static create() {
        return new Stopwatch(Date.now());
    }

    /**
     * Execute the given code in a stopwatch and callback so we can log it or
     * perform other operations on the stopwatch.
     */
    public static withStopwatch<T>(delegate: () => T,
                                   onFinished: (stopwatch: Stopwatch) => void): T {

        const stopwatch = Stopwatches.create();

        try {

            return delegate();

        } finally {
            stopwatch.stop();
            onFinished(stopwatch);
        }

    }

    /**
     * Execute the given code in a stopwatch and callback so we can log it or
     * perform other operations on the stopwatch.
     */
    public static async withStopwatchAsync<T>(delegate: () => Promise<T>,
                                              onFinished: (stopwatch: Stopwatch) => void): Promise<T> {

        const stopwatch = Stopwatches.create();

        try {

            return await delegate();

        } finally {
            stopwatch.stop();
            onFinished(stopwatch);
        }

    }

}
