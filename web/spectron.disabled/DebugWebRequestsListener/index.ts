import {BrowserWindow} from 'electron';
import {SpectronMain} from '../../js/test/SpectronMain';
import {WebRequestReactor} from '../../js/webrequests/WebRequestReactor';
import {DebugWebRequestsListener} from '../../js/webrequests/DebugWebRequestsListener';
import {LoggerDelegate} from 'polar-shared/src/logger/LoggerDelegate';
import {MemoryLogger} from '../../js/logger/MemoryLogger';

import assert from 'assert';

let log = new MemoryLogger();
//let log = new ConsoleLogger();
LoggerDelegate.set(log);

async function createMainWindow() {

    let mainWindow = new BrowserWindow();

    let webRequestReactor = new WebRequestReactor(mainWindow.webContents.session.webRequest);
    webRequestReactor.start();

    let debugWebRequestsListener = new DebugWebRequestsListener();
    debugWebRequestsListener.register(webRequestReactor);

    mainWindow.loadURL('http://httpbin.org/get');
    return mainWindow;

}

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    // now make sure the log data is properly stored.

    let output = log.toJSON();

    console.log("log output =========");
    console.log(output);
    console.log("DONE log output =========");

    assert.ok(output.indexOf("onBeforeRequest") !== -1);
    //
    // // make sure we have all the events we need.  We could probably test
    // // this more by asserting the entire JSON output but that might
    // // be a bit heavy.
    // assert.equal(logData.indexOf("onBeforeRequest") !== -1, true);
    // assert.equal(logData.indexOf("onBeforeSendHeaders") !== -1, true);
    // assert.equal(logData.indexOf("onSendHeaders") !== -1, true);
    // assert.equal(logData.indexOf("onResponseStarted") !== -1, true);
    // assert.equal(logData.indexOf("onCompleted") !== -1, true);

    await state.testResultWriter.write(true);

}, {windowFactory: createMainWindow});

