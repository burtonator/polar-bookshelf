import {Duration} from 'polar-shared/src/util/TimeDurations';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {defaultValue} from 'polar-shared/src/Preconditions';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

export class Executors {

    /**
     * Run the given function periodically
     */
    public static runPeriodically(opts: PeriodicOpts, handler: () => void) {

        let iter: number = 0;

        const maxIterations = defaultValue(opts.maxIterations, Number.MAX_VALUE);

        const onCompletion = defaultValue(opts.onCompletion, NULL_FUNCTION);

        const scheduleNextUpdate = (interval: Duration) => {

            const intervalMS = TimeDurations.toMillis(interval);

            setTimeout(() => {

                doExecute();

            }, intervalMS);

        };

        const doExecute = () => {

            try {

                handler();

            } finally {
                ++iter;

                if (iter < maxIterations) {
                    scheduleNextUpdate(opts.interval);
                } else {
                    onCompletion();
                }

            }

        };

        if (opts.initialDelay !== undefined) {
            scheduleNextUpdate(opts.initialDelay);
        } else {
            doExecute();
        }

    }

}

interface PeriodicOpts {

    readonly interval: Duration;

    readonly initialDelay?: Duration;

    readonly maxIterations?: number;

    /**
     * Call the given function on completion.
     */
    readonly onCompletion?: () => void;

}
