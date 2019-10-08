
import {webContents} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import {Promises} from '../../js/util/Promises';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    await state.testResultWriter.write(true);

});
