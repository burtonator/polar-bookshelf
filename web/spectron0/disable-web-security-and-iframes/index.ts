import {SpectronMain2} from '../../js/test/SpectronMain2';
import {app, BrowserWindow} from 'electron';

app.commandLine.appendSwitch('disable-site-isolation-trials');

async function defaultWindowFactory(): Promise<BrowserWindow> {

    const options = {

        backgroundColor: '#FFF',

        // NOTE: the default width and height shouldn't be changed here as it can
        // break unit tests.

        // width: 1000,
        // height: 1000,

        show: true,

        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            partition: "persist:spectron",
            webviewTag: true,
            offscreen: false,
            disableBlinkFeatures: "SitePerProcess,OriginTrials,OriginTrialsSampleAPI,OriginTrialsSampleAPIDependent,OriginTrialsSampleAPIImplied,OriginTrialsSampleAPIInvalidOS,OriginTrialsSampleAPINavigation"
        }

    };

    console.log("Creating window with options: ", options);

    const mainWindow = new BrowserWindow(options);
    await mainWindow.loadURL('about:blank');

    return mainWindow;
}

SpectronMain2.create({windowFactory: defaultWindowFactory}).run(async state => {

    await state.window.loadURL(`https://kyso.io/KyleOS/nbestimate`, {extraHeaders: "Content-Security-Policy: '*'"});


    // await state.window.loadURL(`https://getpolarized.io/capture-debug/iframe-1.html`, {extraHeaders: "Content-Security-Policy: '*'"});
    //

    await state.testResultWriter.write(true);

});

