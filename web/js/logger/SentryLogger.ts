import {ILogger} from 'polar-shared/src/logger/ILogger';

import { init, captureException } from '@sentry/electron';
import {isPresent} from 'polar-shared/src/Preconditions';
import process from "process";

// This configures the Electron CrashReporter for native app crashes and
// captures any uncaught JavaScript exceptions using the JavaScript SDKs under
// the hood. Be sure to call this function as early as possible in the main
// process and all renderer processes to also catch errors during startup.

let initialized: boolean = false;

// true when sentry is ready for logging.
let ready: boolean = false;

export class SentryLogger implements ILogger {

    public readonly name: string = 'sentry-logger';

    public notice(msg: string, ...args: any[]) {
        SentryLogger.initWhenNecessary();
    }

    public warn(msg: string, ...args: any[]) {
        SentryLogger.initWhenNecessary();
    }

    public error(msg: string, ...args: any[]) {

        SentryLogger.initWhenNecessary();

        if (ready) {

            args.forEach(arg => {

                if ( arg instanceof Error) {

                    // This captures 'handles' exceptions as Sentry wouldn't actually
                    // capture these as they aren't surfaced to Electron.
                    captureException(arg);
                }

            });

        }
    }

    public info(msg: string, ...args: any[]) {
        SentryLogger.initWhenNecessary();
    }

    public verbose(msg: string, ...args: any[]) {
        SentryLogger.initWhenNecessary();
    }

    public debug(msg: string, ...args: any[]) {
        SentryLogger.initWhenNecessary();
    }

    public async sync(): Promise<void> {
        SentryLogger.initWhenNecessary();
    }

    public static isEnabled() {

        if (isPresent(process.env.POLAR_SENTRY_ENABLED)) {
            return process.env.POLAR_SENTRY_ENABLED === 'true';
        }

        return ! isPresent(process.env.SNAP);
    }

    private static initWhenNecessary() {

        if (initialized) {
            return;
        }

        try {

            if (SentryLogger.isEnabled()) {
                init({
                    dsn: 'https://2e8b8ca6e6bf4bf58d735f2a405ecb20@sentry.io/1273707',
                    // more options...
                });
            }

            ready = true;

        } catch (e) {
            console.error("Unable to initialize sentry: ", e);
        } finally {
            initialized = true;
        }

    }

}

