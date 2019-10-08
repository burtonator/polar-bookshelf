/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';

/**
 * Annotates logs by including the time.
 */
export class TimeAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `time-annotating-logger -> ${delegate.name}`;
    }

    public notice(msg: string, ...args: any[]) {
        this.delegate.notice(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public info(msg: string, ...args: any[]) {
        this.delegate.info(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        this.delegate.warn(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public error(msg: string, ...args: any[]) {
        this.delegate.error(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        this.delegate.debug(this.createTimestamp() + `: ${msg}`, ...args);
    }

    public async sync(): Promise<void> {
        // noop
    }

    private createTimestamp() {
        return new Date().toUTCString();
    }

}
