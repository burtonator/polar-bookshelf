import {LoggerDelegate} from 'polar-shared/src/logger/LoggerDelegate';
import {FilteredLogger} from './FilteredLogger';
import {ConsoleLogger} from 'polar-shared/src/logger/ConsoleLogger';
import {LevelAnnotatingLogger} from './annotating/LevelAnnotatingLogger';
import {VersionAnnotatingLogger} from './annotating/VersionAnnotatingLogger';
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {Directories} from '../datastore/Directories';
import {LogLevel} from './LogLevel';
import {Files} from 'polar-shared/src/util/Files';
import {LogLevels} from './LogLevels';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {MultiLogger} from './MultiLogger';
import {SentryLogger} from './SentryLogger';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {ElectronContextType} from '../electron/context/ElectronContextType';
import {ElectronContextTypes} from '../electron/context/ElectronContextTypes';
import {ToasterLogger} from './ToasterLogger';
import {PersistentErrorLogger} from './PersistentErrorLogger';

import process from 'process';
import {MemoryLogger} from './MemoryLogger';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {AppRuntime} from '../AppRuntime';
import {GALogger} from './GALogger';

/**
 * Maintains our general logging infrastructure.  Differentiated from Logger
 * which performs the actual logging of message. This maintains Loggers.
 */
export class Logging {

    /**
     * Initialize the logger to write to a specific directory.
     */
    public static async init() {

        const level = this.configuredLevel();

        const target: ILogger = await this.createTarget(level);

        await this.initWithTarget(target);

    }

    /**
     * Initialize a logger suitable for testing.
     */
    public static initForTesting() {

        const level = this.configuredLevel();

        const target = new ConsoleLogger();

        const delegate =
            new FilteredLogger(
                new VersionAnnotatingLogger(
                    new LevelAnnotatingLogger(target)), level);

        LoggerDelegate.set(delegate);

    }

    public static async initWithTarget(target: ILogger) {

        const lc = await this.loggingConfig();

        const delegate =
            new FilteredLogger(
                new VersionAnnotatingLogger(
                    new LevelAnnotatingLogger(target)), lc.level);

        LoggerDelegate.set(delegate);

        const logger = LoggerDelegate.get();

        logger.info(`Using logger: ${logger.name}: target=${lc.target}, level=${LogLevel[lc.level]}`);

    }

    public static async createTarget(level: LogLevel): Promise<ILogger> {

        const loggers: ILogger[] = [];

        const electronContext = ElectronContextTypes.create();

        if (level === LogLevel.WARN && SentryLogger.isEnabled() && AppRuntime.isElectron()) {
            // SentryLogger enabled for INFO will lock us up.
            // *** first logger is sentry but only if we are not running within
            // a SNAP container.
            loggers.push(new SentryLogger());
        }

        // *** next up is the Toaster Logger to visually show errors.

        if (['electron-renderer'].includes(AppRuntime.get())) {
            // use a ToasterLogger when running in the renderer context so that
            // we can bring up error messages for the user.
            loggers.push(new ToasterLogger());
        }

        if (['electron-renderer', 'browser'].includes(AppRuntime.get())) {
            // use a ToasterLogger when running in the renderer context so that
            // we can bring up error messages for the user.
            loggers.push(new GALogger());
        }

        if (electronContext === ElectronContextType.RENDERER) {
            // when in the renderer use the memory logger so that we can show
            // logs in the log view
            loggers.push(new MemoryLogger());
        }

        // *** now include the persistent error log so that we can get error
        // reports from users.

        if (level === LogLevel.WARN && AppRuntime.isElectron()) {
            // PersistentErrorLogger enabled for INFO will lock us up.
            loggers.push(await PersistentErrorLogger.create());
        }

        // *** last is the primary log. Either disk or the console.

        loggers.push(await this.createPrimaryTarget());

        return new MultiLogger(...loggers);

    }


    public static async createPrimaryTarget(): Promise<ILogger> {

        const loggingConfig = await this.loggingConfig();

        if (loggingConfig.target === LoggerTarget.CONSOLE) {
        return new ConsoleLogger();
        } else {
            throw new Error("Invalid target: " + loggingConfig.target);
        }

    }

    private static async loggingConfig(): Promise<LoggingConfig> {

        if (AppRuntime.isElectron()) {

            const directories = await new Directories().init();

            const path = FilePaths.join(directories.configDir, 'logging.json');

            if (await Files.existsAsync(path)) {

                const buffer = await Files.readFileAsync(path);
                const json = buffer.toString('utf8');
                let config = JSON.parse(json) as LoggingConfig;

                if (typeof config.level === 'string') {

                    // needed to convert the symbol back to the enum.  Not sure
                    // this is very clean though and wish there was a better way
                    // to do this.

                    config = {
                        level: LogLevels.fromName(config.level),
                        target: config.target
                    };

                }

                return config;

            }

        }

        return {
            target: LoggerTarget.CONSOLE,
            level: this.configuredLevel()
        };

    }

    private static configuredLevel(): LogLevel {

        const isRendererContext = typeof window !== 'undefined';

        const fromENV = (): Optional<string> => {
            return Optional.of(process.env.POLAR_LOG_LEVEL);
        };

        const fromStorage = (storage: Storage): Optional<string> => {
            return Optional.of(storage.getItem("POLAR_LOG_LEVEL"));
        };

        const fromLocalStorage = (): Optional<string> => {

            if (isRendererContext) {
                return fromStorage(window.localStorage);
            }

            return Optional.empty();

        };

        const fromSessionStorage = (): Optional<string> => {

            if (isRendererContext) {
                return fromStorage(window.sessionStorage);
            }

            return Optional.empty();

        };

        const level = Optional.first<string>(fromENV(), fromLocalStorage(), fromSessionStorage())
            .map(level => LogLevels.fromName(level))
            .getOrElse(LogLevel.WARN);

        return level;

    }

}

enum LoggerTarget {
    CONSOLE = 'CONSOLE',
    // DISK = 'DISK'
}

/**
 * Basic disk config for our log information.
 */
export interface LoggingConfig {
    readonly target: LoggerTarget;
    readonly level: LogLevel;
}


export interface LogMessage {

    /**
     * A unique number for this LogMessage, just needs to be unique to the
     * process and we should be able to use a simple nonce.
     */
    readonly idx: number;

    readonly timestamp: ISODateTimeString;

    readonly level: LogLevelName;
    readonly msg: string;
    readonly args: ReadonlyArray<any>;
}

export type LogLevelName = 'notice' | 'info' | 'warn' | 'error' | 'verbose' | 'debug';
