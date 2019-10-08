const {Functions} = require("polar-shared/src/util/Functions");
const {SpectronRenderer} = require("../../../js/test/SpectronRenderer");
const {TestResultsService} = require("../../../web/js/test/results/TestResultsService");

async function start() {

    let mainWindow = await SpectronRenderer.start();

    //mainWindow.loadURL("https://www.example.com");
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // FIXME we have to wait until the page loads.

    function setTestResults() {
        window.test_results = "hello";
    }

    let script = Functions.functionToScript(setTestResults);

    await mainWindow.webContents.executeJavaScript(script)

}

start().catch(err => console.log(err));
