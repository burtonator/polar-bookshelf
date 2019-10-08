/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';

/**
 * A logger that calls a delegate with try/catch and then does a console.error
 * if the underlying logger fails.
 *
 */
export class SafeLogger implements ILogger {

    public readonly name: string ;

    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = 'safe-logger+' + delegate.name;
    }

    public notice(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.notice(msg, ...args));
    }

    public warn(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.warn(msg, ...args));
    }

    public error(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.error(msg, ...args));
    }

    public info(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.info(msg, ...args));
    }

    public verbose(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.verbose(msg, ...args));
    }

    public debug(msg: string, ...args: any[]) {
        this.withTryCatch(() => this.delegate.debug(msg, ...args));
    }


    public async sync(): Promise<void> {
        await this.delegate.sync();
    }

    private withTryCatch(logFunction: () => void) {

        try {
            logFunction();
        } catch (e) {
            // NOTE that we can't log anything safely about the original
            // failure because if we do then we might cause the same problem.
            console.error("Unable to log: ", e);
        }

    }

}
