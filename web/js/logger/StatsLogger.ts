import {ILogger} from 'polar-shared/src/logger/ILogger';

/**
 * Does nothing other than collect stats on which methods were called for
 * testing purposes.
 */
export class StatsLogger implements ILogger {

    public readonly name: string = "stats";

    public readonly stats = new FilteredStats();

    public notice(msg: string, ...args: any[]) {
        ++this.stats.notice;
    }

    public debug(msg: string, ...args: any[]) {
        ++this.stats.debug;
    }

    public verbose(msg: string, ...args: any[]) {
        ++this.stats.verbose;
    }

    public info(msg: string, ...args: any[]) {
        ++this.stats.info;
    }

    public warn(msg: string, ...args: any[]) {
        ++this.stats.warn;
    }

    public error(msg: string, ...args: any[]) {
        ++this.stats.error;
    }

    public async sync(): Promise<void> {
        // noop
    }

}

export class FilteredStats {
    public notice: number = 0;
    public debug: number = 0;
    public verbose: number = 0;
    public info: number = 0;
    public warn: number = 0;
    public error: number = 0;
}
