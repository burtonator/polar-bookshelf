/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {Files} from 'polar-shared/src/util/Files';
import {ElectronContextTypes} from '../electron/context/ElectronContextTypes';
import {ElectronContextType} from '../electron/context/ElectronContextType';
import {Directories} from '../datastore/Directories';

const delegate = require('electron-log');

class ElectronLogger implements ILogger {

    public readonly name: string = 'electron-logger';

    public notice(msg: string, ...args: any[]) {
        delegate.log(msg, ...args);
    }

    public info(msg: string, ...args: any[]) {
        delegate.log(msg, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        delegate.warn(msg, ...args);
    }

    public error(msg: string, ...args: any[]) {
        delegate.error(msg, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        delegate.verbose(msg, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        delegate.debug(msg, ...args);
    }

    public async sync(): Promise<void> {
        // noop
    }

}

export class ElectronLoggers {

    public static create() {

        const directories = new Directories();

        if (ElectronContextTypes.create() === ElectronContextType.MAIN) {

            // *** configure console
            delegate.transports.console.level = "info";
            delegate.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

            // *** configure file

            // set the directory name properly
            delegate.transports.file.writeFile = `${directories.logsDir}/polar.log`;
            delegate.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

            delegate.transports.file.level = "info";
            delegate.transports.file.appName = "polar";

            console.log("Configured main electron logger writing to: " + directories.logsDir);

        } else {
            console.log("Skipping ElectronLogger initialization (running in renderer)");
        }

        return new ElectronLogger();

    }

}
