import {SpectronMain} from '../../js/test/SpectronMain';

SpectronMain.run(async state => {

    await state.window.loadURL(`file://${__dirname}/app.html`);

});
