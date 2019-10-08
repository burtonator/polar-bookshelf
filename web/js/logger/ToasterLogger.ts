/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {Toaster} from '../ui/toaster/Toaster';

/**
 * Creates a toast when when an error or a warning is displayed. No other
 * messages are displayed though because it would be silly to render them
 * otherwise.
 */
export class ToasterLogger implements ILogger {

    public readonly name: string = 'toaster-logger';

    public notice(msg: string, ...args: any[]) {
    }

    public warn(msg: string, ...args: any[]) {
        // Toaster.warning(msg);
    }

    public error(msg: string, ...args: any[]) {

        if (args.length > 0 && args[0] instanceof Error) {
            Toaster.persistentError("An internal error has occurred.");
        } else {
            Toaster.error(msg);
        }

    }

    public info(msg: string, ...args: any[]) {
    }

    public verbose(msg: string, ...args: any[]) {
    }

    public debug(msg: string, ...args: any[]) {
    }

    public async sync(): Promise<void> {
        // noop
    }

}
