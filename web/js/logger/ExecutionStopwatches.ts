import {DurationStr, Duration} from 'polar-shared/src/util/TimeDurations';
import {Stopwatches} from '../util/Stopwatches';
import {DurationMS} from 'polar-shared/src/util/TimeDurations';
import {Logger} from 'polar-shared/src/logger/Logger';

// TODO: I would like to resume this in the future but the design here is
// difficult:
//
// - is the Logger created with the right name if called from a function?
//   Probably not because we're looking at the calls stack and this adds another
//   frame
//
// - I could add this to Logger directly and have timed() there or create this
//   with a const at the top level FROM the log (this is probably the best
//   option) and call it something like a tracer or a tracker or a timer and
//   some of them could have more functions like one could call
//   RendererAnalytics with a timer.
//
// - I could make ALL the loggers extends BaseLogger which is an ILogger but
//   also adds this timing functinonality below.

export class ExecutionStopwatches {

    public static create<T>(name: string, delegate: () => T, thresholds: Thresholds = new DefaultThresholds()): T {

        // TODO: ability to specify just ONE level or a name for the trace

        const log = Logger.create();

        const stopwatch = Stopwatches.create();

        try {

            return delegate();

        } finally {

            const trackedDuration = stopwatch.stop();

        }

    }

    private static toLevel(duration: DurationMS, thresholds: Thresholds): ThresholdLevel | undefined {

        if (duration > thresholds.error) {
            return 'error';
        } else if (duration > thresholds.warn) {
            return 'warn';
        } else if (duration > thresholds.info) {
            return 'info';
        }

        return undefined;

    }

}

export interface Thresholds {

    readonly info: Duration;

    readonly warn: Duration;

    readonly error: Duration;

}

class DefaultThresholds implements Thresholds {

    public readonly info = 500;

    public readonly warn = 1000;

    public readonly error = 1500;

}

type ThresholdLevel = 'error' | 'warn' | 'info';
