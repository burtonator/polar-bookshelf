import {SpectronMain, WindowFactory} from '../../../js/test/SpectronMain';
import {BrowserWindow} from "electron";


export const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    // width: 1000,
    // height: 1000,

    webPreferences: {
        webSecurity: false,
        nodeIntegration: false
    }

};

const windowFactory: WindowFactory = async () => {
    const mainWindow = new BrowserWindow(BROWSER_OPTIONS);
    // mainWindow.webContents.toggleDevTools();
    await mainWindow.loadURL('about:blank');
    return mainWindow;
};

SpectronMain.run(async state => {

    await state.window.loadFile(__dirname + '/app.html');

    await state.testResultWriter.write(true);

}, {windowFactory});
