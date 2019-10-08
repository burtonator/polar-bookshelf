import process from "process";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class MainAppExceptionHandlers {

    public static register() {

        // we have to create uncaught exception handlers here when exiting
        // the app as I think they're getting removed.
        process.on('uncaughtException', err => {
            log.error("Uncaught exception: ", err);
        });

        process.on('unhandledRejection', err => {
            log.error("Unhandled rejection: ", err);
        });

    }
}


