import {app, BrowserWindow} from 'electron';
import {ISpectronMainOptions, SpectronMain2} from '../../js/test/SpectronMain2';
import {WebserverConfig} from '../../js/backend/webserver/WebserverConfig';
import {Webserver} from '../../js/backend/webserver/Webserver';
import {FileRegistry} from '../../js/backend/webserver/FileRegistry';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {AppPath} from '../../js/electron/app_path/AppPath';

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const mainWindow = new BrowserWindow(SpectronBrowserWindowOptions.create());
    mainWindow.loadURL('about:blank');
    return mainWindow;
}

const options: ISpectronMainOptions = {
    windowFactory: defaultWindowFactory
};

AppPath.set(__dirname);

SpectronMain2.create(options).run(async state => {

    const appDir = process.cwd();
    const webserverConfig = new WebserverConfig(appDir, 8005);

    const fileRegistry = new FileRegistry(webserverConfig);
    const webserver = new Webserver(webserverConfig, fileRegistry);

    try {
        await webserver.start();
    } catch (e) {
        console.warn("Webserver already running.");
    }

    await state.window.loadURL(`http://localhost:8005/web/spectron/localstorage/content.html`);

    const window = await defaultWindowFactory();
    window.loadURL(`http://localhost:8005/web/spectron/localstorage/content2.html`);

});




