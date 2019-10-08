import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {assert} from 'chai';
import waitForExpect from 'wait-for-expect';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FileImportClient} from '../../js/apps/repository/FileImportClient';
import {Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {AppInstances} from '../../js/electron/framework/AppInstances';
import {AppPath} from '../../js/electron/app_path/AppPath';
import {FileImportRequests} from '../../js/apps/repository/FileImportRequests';
import BrowserWindow = Electron.BrowserWindow;

const log = Logger.create();

AppPath.set(FilePaths.resolve(__dirname, "..", "..", ".."));

async function createWindow(): Promise<BrowserWindow> {

    await PolarDataDir.useFreshDirectory('.polar-main-app-with-import');

    const datastore: Datastore = new DiskDatastore();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);

    const mainAppState = await mainApp.start();

    return mainAppState.mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {

    log.info("Waiting for repository to show...");

    log.info("Waiting for repository app...");

    await waitForExpect(() => {
        const windows = BrowserWindowRegistry.tagged({name: 'app', value: 'repository'});
        assert.ok(windows.length === 1);
    });

    log.info("Waiting for repository app...done");

    const rawPath = FilePaths.join(__dirname, "..", "..", "..", "docs", "example.pdf");
    const importFilePath = await Files.realpathAsync(rawPath);
    assert.ok(await Files.existsAsync(importFilePath));

    const files = [
        importFilePath
    ];

    await AppInstances.waitForStarted('RepositoryApp');

    log.info("Sending file import client request...");
    FileImportClient.send(FileImportRequests.fromPaths(files));

    log.info("Trying to find viewer...");

    await waitForExpect(() => {
        const windows = BrowserWindowRegistry.tagged({name: 'type', value: 'viewer'});
        assert.ok(windows.length > 0);
    });

    log.info("Trying to find viewer...done");

    const pdfStashPath = FilePaths.join(PolarDataDir.get()!, "stash", "12i77BKrNy-example.pdf");

    log.info("Testing for file: " + pdfStashPath);
    assert.ok(await Files.existsAsync(pdfStashPath), "File does not exist: " + pdfStashPath);

    await state.testResultWriter.write(true);

});

