import {SpectronMain} from '../../js/test/SpectronMain';
import {Promises} from '../../js/util/Promises';
import Rectangle = Electron.Rectangle;
const fs = require('fs');

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    await Promises.waitFor(5000);

    let rect = {
        x: 0,
        y: 0,
        width: 100,
        height: 1000
    };

    state.window.webContents.capturePage(rect, image => {
        console.log("Capture finished!");
        fs.writeFileSync('test.png', image.toPNG());

    });

    await state.testResultWriter.write(true);

});
