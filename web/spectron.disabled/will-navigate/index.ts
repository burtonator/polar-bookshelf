import {shell} from 'electron';
import {SpectronMain} from '../../js/test/SpectronMain';
import {BrowserWindow} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    webPreferences: {
        webSecurity: false,
    }

};

let options = {

    windowFactory: async () => {

        let mainWindow = new BrowserWindow(BROWSER_OPTIONS);

        mainWindow.webContents.on('will-navigate', function(e, url) {
            log.info("Attempt to navigate to new URL: ", url);
            // required to force the URLs clicked to open in a new browser.  The
            // user probably / certainly wants to use their main browser.
            e.preventDefault();
            shell.openExternal(url);
        });

        mainWindow.loadURL('about:blank');
        return mainWindow;

    }

};

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    await state.testResultWriter.write(true);

}, options);
