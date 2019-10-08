import {ILogger} from 'polar-shared/src/logger/ILogger';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {GALoggers} from './GALoggers';

/**
 * Logs errors as custom events within GA.
 */
export class GALogger implements ILogger {

    public readonly name: string = 'ga-logger';

    public notice(msg: string, ...args: any[]) {
        // noop
    }

    public warn(msg: string, ...args: any[]) {
        // noop
    }

    public error(msg: string, ...args: any[]) {

        const error = GALoggers.getError(args);

        const event = GALoggers.toEvent(error);

        if (event) {
            RendererAnalytics.event(event);
        }

    }

    public info(msg: string, ...args: any[]) {
        // noop
    }

    public verbose(msg: string, ...args: any[]) {
        // noop
    }

    public debug(msg: string, ...args: any[]) {
        // noop
    }

    public async sync(): Promise<void> {
        // noop
    }

}

