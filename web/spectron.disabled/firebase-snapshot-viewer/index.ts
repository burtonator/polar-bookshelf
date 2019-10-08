import {app, BrowserWindow} from 'electron';
import {ISpectronMainOptions, SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import process from "process";
import {AppPath} from '../../js/electron/app_path/AppPath';
import {WebserverTester} from '../../js/backend/webserver/WebserverTester';

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const mainWindow = new BrowserWindow(SpectronBrowserWindowOptions.create());
    mainWindow.loadURL('about:blank');
    return mainWindow;
}


const options: ISpectronMainOptions = {
    windowFactory: defaultWindowFactory
};

SpectronMain2.create(options).run(async state => {

    await PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

    WebserverTester.run(__dirname);

    const url = `http://localhost:8005/content.html`;
    await state.window.loadURL(url);

});

