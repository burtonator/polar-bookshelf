import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Files} from 'polar-shared/src/util/Files';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Directories} from '../datastore/Directories';

const log = Logger.create();

export class PolarDataDir {

    public static async useFreshDirectory(name: string): Promise<string> {

        const dataDir = FilePaths.createTempName(name);
        process.env.POLAR_DATA_DIR = dataDir;
        console.log("Using new dataDir: " + dataDir);
        await Files.removeDirectoryRecursivelyAsync(dataDir);

        const directories = new Directories();

        await Files.createDirAsync(directories.dataDir),
        await Files.createDirAsync(directories.stashDir),
        await Files.createDirAsync(directories.logsDir),
        await Files.createDirAsync(directories.configDir),

        log.info("Using polar data dir: " + dataDir);

        return dataDir;

    }

    public static async reuseDirectory(name: string): Promise<string> {

        const dataDir = FilePaths.createTempName(name);
        process.env.POLAR_DATA_DIR = dataDir;

        const directories = new Directories();
        await directories.init();

        log.info("Using polar data dir: " + dataDir);

        return dataDir;

    }

    public static get() {
        return process.env.POLAR_DATA_DIR;
    }

}
