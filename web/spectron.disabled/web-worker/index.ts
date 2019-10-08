import {SpectronMain2} from '../../js/test/SpectronMain2';

SpectronMain2.create().run(async state => {

    await state.window.loadURL(`file://${__dirname}/test.html`);

    await state.testResultWriter.write(true);

});

