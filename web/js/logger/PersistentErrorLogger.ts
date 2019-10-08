/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {FileLogger} from './FileLogger';
import {Directories} from '../datastore/Directories';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

/**
 * A logger which writes to disk but ONLY if they are errors.  This is needed
 * for performance reasons as electron-log isn't amazingly fast.
 */
export class PersistentErrorLogger implements ILogger {

    public readonly name: string = 'persistent-error-logger';

    private readonly delegate: ILogger;

    private constructor(delegate: ILogger) {
        this.delegate = delegate;
    }

    public notice(msg: string, ...args: any[]) {
        this.delegate.notice(msg, ...args);
    }

    public error(msg: string, ...args: any[]) {
        this.delegate.error(msg, ...args);
    }

    public info(msg: string, ...args: any[]) {
        // noop
    }

    public warn(msg: string, ...args: any[]) {
        // noop
    }

    public verbose(msg: string, ...args: any[]) {
        // noop
    }

    public debug(msg: string, ...args: any[]) {
        // noop
    }

    public async sync(): Promise<void> {
        await this.delegate.sync();
    }

    public static async create(): Promise<PersistentErrorLogger> {
        const directories = new Directories();
        const path = FilePaths.create(directories.logsDir, "error.log");
        const fileLogger = await FileLogger.create(path);
        return new PersistentErrorLogger(fileLogger);
    }

}
