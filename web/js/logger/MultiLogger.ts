/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {SafeLogger} from './SafeLogger';

/**
 * Allows us to log to multiple delegates at once.
 */
export class MultiLogger implements ILogger {

    public readonly name: string ;

    private readonly delegates: ILogger[];

    constructor(...delegates: ILogger[]) {

        // Make the delegates use safe loggers so that if any one fails the
        // exceptions are handled gracefully and don't choke other loggers.
        delegates = MultiLogger.toSafeLoggers(delegates);

        this.delegates = delegates;

        this.name = 'multi-logger|'
            + this.delegates.map(delegate => delegate.name).join("+");
    }

    public notice(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.notice(msg, ...args));
    }

    public warn(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.warn(msg, ...args));
    }

    public error(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.error(msg, ...args));
    }

    public info(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.info(msg, ...args));
    }

    public verbose(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.verbose(msg, ...args));
    }

    public debug(msg: string, ...args: any[]) {
        this.delegates.forEach(delegate => delegate.debug(msg, ...args));
    }

    public async sync(): Promise<void> {

        for (const delegate of this.delegates) {
            await delegate.sync();
        }

    }

    private static toSafeLoggers(delegates: ILogger[]) {

        return delegates.map(current => {
            if (current instanceof SafeLogger) {
                return current;
            } else {
                return new SafeLogger(current);
            }
        });

    }



}
