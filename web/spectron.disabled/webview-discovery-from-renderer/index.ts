import {SpectronMain} from '../../js/test/SpectronMain';

SpectronMain.run(async state => {

    await state.window.loadFile(__dirname + '/app.html');

});


