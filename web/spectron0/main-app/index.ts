import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {assert} from 'chai';
import waitForExpect from 'wait-for-expect';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Files} from 'polar-shared/src/util/Files';
import {MainAppController} from '../../js/apps/main/MainAppController';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {AppPath} from '../../js/electron/app_path/AppPath';
import BrowserWindow = Electron.BrowserWindow;

const log = Logger.create();

let polarDir: PolarDir | undefined;
let mainAppController: MainAppController | undefined;

AppPath.set(FilePaths.resolve(__dirname, "..", "..", ".."));

async function createWindow(): Promise<BrowserWindow> {

    polarDir = await setupNewDataDir();

    const datastore: Datastore = new MemoryDatastore();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);

    const mainAppState = await mainApp.start();
    mainAppController = mainAppState.mainAppController;

    return mainAppState.mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {

    log.info("Waiting for repository to show...");

    await waitForExpect(() => {
        const windows = BrowserWindowRegistry.tagged({name: 'app', value: 'repository'});
        assert.ok(windows.length === 1);

    });

    await mainAppController!.handleLoadDoc(polarDir!.files[0]);

    await mainAppController!.handleLoadDoc(polarDir!.files[1]);

    // TODO: now make sure their metadata appears in the repo

    // TODO: make sure the flashcard app is ready and running in the background

    // TODO: switch to the main repository app and double click on a document.
    // Might need to do this in the renderer context though as part of another
    // test.

    await state.testResultWriter.write(true);

});

async function setupNewDataDir(): Promise<PolarDir> {

    const dataDir = await PolarDataDir.useFreshDirectory('.polar-main-app');

    log.info("Using new dataDir: " + dataDir);

    const stashDir = FilePaths.create(dataDir, 'stash');

    const filenames = ['example.pdf', 'example.phz'];

    const files: string[] = [];

    for (const filename of filenames) {

        const srcPath = FilePaths.join(__dirname, 'files', filename);
        const targetPath = FilePaths.join(stashDir, filename);

        await Files.copyFileAsync(srcPath, targetPath);

        files.push(targetPath);
    }

    return {
        files
    };

}

interface PolarDir {
    // the files we can open...
    files: string[];
}
