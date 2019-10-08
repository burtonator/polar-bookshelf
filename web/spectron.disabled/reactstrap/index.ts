import {SpectronMain2} from '../../js/test/SpectronMain2';

SpectronMain2.create().run(async state => {

    await state.window.loadURL(`file://${__dirname}/content.html`);

    // await state.testResultWriter.write(true);

});
