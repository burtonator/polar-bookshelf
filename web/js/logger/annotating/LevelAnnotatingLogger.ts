/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';

/**
 * Annotates log calls with the level.  Helpful when the target is the
 * console logger.
 */
export class LevelAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `level-annotating-logger -> ${delegate.name}`;
    }

    public notice(msg: string, ...args: any[]) {
        this.delegate.info(`[notice] ${msg}`, ...args);
    }

    public info(msg: string, ...args: any[]) {
        this.delegate.info(`[info] ${msg}`, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        this.delegate.warn(`[warn] ${msg}`, ...args);
    }

    public error(msg: string, ...args: any[]) {
        this.delegate.error(`[error] ${msg}`, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(`[verbose] ${msg}`, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        this.delegate.debug(`[debug] ${msg}`, ...args);
    }

    public async sync(): Promise<void> {
        await this.delegate.sync();
    }


}
