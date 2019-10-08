import {SpectronMain} from "../../js/test/SpectronMain";

async function start() {
    let mainWindow = await SpectronMain.setup();
    //mainWindow.loadURL("https://www.example.com");
    mainWindow.loadURL('file://' + __dirname + '/index.html')
}

start().catch(err => console.log(err));
