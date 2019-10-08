import {SpectronMain} from '../../js/test/SpectronMain';
import {ScreenshotService} from '../../js/screenshots/electron/ScreenshotService';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    let screenshotService = new ScreenshotService();
    screenshotService.start();

    await state.testResultWriter.write(true);

});
