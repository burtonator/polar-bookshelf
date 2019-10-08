import {ILogger} from 'polar-shared/src/logger/ILogger';
import {LogLevel} from './LogLevel';

export class FilteredLogger implements ILogger {

    constructor(delegate: ILogger, level: LogLevel = LogLevel.INFO) {
        this.delegate = delegate;
        this.level = level;
        this.name = `filtered-logger -> ${delegate.name}`;
    }

    public readonly level: LogLevel;

    public readonly name: string;

    private readonly delegate: ILogger;

    public notice(msg: string, ...args: any[]) {
        this.delegate.notice(msg, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        if (this.level < LogLevel.DEBUG) { return; }
        this.delegate.debug(msg, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        if (this.level < LogLevel.VERBOSE) { return; }
        this.delegate.verbose(msg, ...args);
    }

    public info(msg: string, ...args: any[]) {
        if (this.level < LogLevel.INFO) { return; }
        this.delegate.info(msg, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        if (this.level < LogLevel.WARN) { return; }
        this.delegate.warn(msg, ...args);
    }

    public error(msg: string, ...args: any[]) {
        if (this.level < LogLevel.ERROR) { return; }
        this.delegate.error(msg, ...args);
    }

    public async sync(): Promise<void> {
        await this.delegate.sync();
    }

}
