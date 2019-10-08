/**
 * Represents key local directories for Polar when running locally.
 */
import {DataDir, DataDirConfig, DiskDatastore} from './DiskDatastore';
import {CreateDirResult, Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {isPresent} from 'polar-shared/src/Preconditions';

export class Directories {

    public readonly dataDir: string;
    public readonly stashDir: string;
    public readonly filesDir: string;
    public readonly logsDir: string;
    public readonly configDir: string;

    /**
     *
     *
     * Expose the DataDirConfig so tests and other systems can see how the
     * dataDir was setup for the DiskDatastore.
     */
    public readonly dataDirConfig: DataDirConfig;

    public initialization?: Initialization;

    constructor() {

        this.dataDirConfig = Directories.getDataDir();

        this.dataDir = this.dataDirConfig.path;

        // the path to the stash directory
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.filesDir = FilePaths.create(this.dataDir, "files");
        this.logsDir = FilePaths.create(this.dataDir, "logs");
        this.configDir = FilePaths.create(this.dataDir, "config");

    }

    public async init() {

        this.initialization = {
            dataDir: await Files.createDirAsync(this.dataDir),
            stashDir: await Files.createDirAsync(this.stashDir),
            filesDir: await Files.createDirAsync(this.filesDir),
            logsDir: await Files.createDirAsync(this.logsDir),
            configDir: await Files.createDirAsync(this.configDir)
        };

        return this;

    }

    public static getDataDir(): DataDirConfig {

        let dataDirs: DataDir[] = [
            {
                // configured via static.  I think we should deprecate this in the
                // future as the env var seems more flexible and works across
                // processes when using spectron, renderers, and main.
                path: GlobalDataDir.get(),
                strategy: 'manual'
            },
            {
                // manually configured from the environment
                path: process.env.POLAR_DATA_DIR,
                strategy: 'env'
            },
            {
                path: FilePaths.join(DiskDatastore.getUserHome(), ".polar"),
                strategy: 'home',
            }
        ];

        // remove any paths that are missing...
        dataDirs = dataDirs.filter(current => isPresent(current.path));

        const dataDir = dataDirs[0];

        return {
            path: dataDir.path!,
            strategy: dataDir.strategy
        };

    }

}


/**
 * Allows us to override the data dir internally for testing rather than setting
 * an environment variable.
 */
export class GlobalDataDir {

    private static value: string | undefined = undefined;

    public static set(value: string | undefined) {
        this.value = value;
    }

    public static get() {
        return this.value;
    }

}

/**
 * Results of initialization:
 */
export interface Initialization {
    readonly dataDir: CreateDirResult;
    readonly stashDir: CreateDirResult;
    readonly filesDir: CreateDirResult;
    readonly logsDir: CreateDirResult;
    readonly configDir: CreateDirResult;
}
