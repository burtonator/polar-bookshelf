/**
 * A basic append-only file logger.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {Files} from 'polar-shared/src/util/Files';
import * as util from 'util';

export class FileLogger implements ILogger {

    public readonly name: string;

    private path: string;

    private fd: number;

    constructor(path: string, fd: number) {
        this.path = path;
        this.fd = fd;
        this.name = 'file-logger:' + path;
    }

    public notice(msg: string, ...args: any[]): void {
        this.append('notice', msg, ...args);
    }

    public debug(msg: string, ...args: any[]): void {
        this.append('debug', msg, ...args);
    }

    public error(msg: string, ...args: any[]): void {
        this.append('error', msg, ...args);
    }

    public info(msg: string, ...args: any[]): void {
        this.append('info', msg, ...args);
    }

    public verbose(msg: string, ...args: any[]): void {
        this.append('verbose', msg, ...args);
    }

    public warn(msg: string, ...args: any[]): void {
        this.append('warn', msg, ...args);
    }

    public async sync() {

        return Files.fsyncAsync(this.fd);
    }

    public async close() {
        await Files.closeAsync(this.fd);
    }

    private append(level: string, msg: string, ...args: any[]) {

        const line = FileLogger.format(level, msg, ...args);

        Files.appendFileAsync(this.fd, line)
            // TODO: it might be a good idea to add support for auto-sync in the
            // future but for now I disabled it due to an issue with fsync not
            // working as expected.
            // .then(async () => await this.sync())
            .catch((err) => console.error("Could not write to file logger: ", err));

    }

    public static async create(path: string) {
        const fd = await Files.openAsync(path, 'a');
        return new FileLogger(path, fd);
    }

    protected static format(level: string, msg: string, ...args: any[]) {

        const timestamp = new Date().toISOString();

        let line = `[${timestamp}] [${level}] ${msg}`;

        if (args.length > 0) {

            args.forEach(arg => {

                if ( ! line.endsWith(' ')) {
                    line += ' ';
                }

                if (arg instanceof Error) {

                    const err = arg;

                    line += '\n' + err.stack;

                } else if (typeof arg === 'string' ||
                           typeof arg === 'boolean' ||
                           typeof arg === 'number') {

                    line += arg.toString();

                } else {
                    // convert the object to a string. Do not use JSON.stringify
                    // as it doesn't handle circular references.
                    line += util.inspect(arg, false, undefined, false);
                }

            });

        }

        line += '\n';

        return line;

    }

}
