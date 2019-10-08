import {app, BrowserWindow} from 'electron';
import {ISpectronMainOptions, SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

declare var global: any;

global.appPath = __dirname;

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const mainWindow = new BrowserWindow(SpectronBrowserWindowOptions.create());
    mainWindow.loadURL('about:blank');
    return mainWindow;
}


const options: ISpectronMainOptions = {
    windowFactory: defaultWindowFactory
};

// TODO: the main problems with the home dir are now:
// FIXME: we have to use remote to get the directory to require() our files from
//


SpectronMain2.create(options).run(async state => {

    await PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

    // the webserver must be running as firebase won't load without being on an
    // HTTP URL

    const appDir = process.cwd();
    const webserverConfig = new WebserverConfig(appDir, 8005);

    const fileRegistry = new FileRegistry(webserverConfig);
    const webserver = new Webserver(webserverConfig, fileRegistry);

    try {
        await webserver.start();
    } catch (e) {
        console.warn("Webserver already running.");
    }

    const url = `http://localhost:8005/web/spectron/firebase-datastore/content.html`;
    await state.window.loadURL(url);

});



