import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {assert} from 'chai';
import waitForExpect from 'wait-for-expect';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MainAppController} from '../../js/apps/main/MainAppController';
import BrowserWindow = Electron.BrowserWindow;
import {AppPath} from '../../js/electron/app_path/AppPath';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

const log = Logger.create();

let mainAppController: MainAppController | undefined;

AppPath.set(FilePaths.resolve(__dirname, "..", "..", ".."));

async function createWindow(): Promise<BrowserWindow> {

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

    await state.testResultWriter.write(true);

});
