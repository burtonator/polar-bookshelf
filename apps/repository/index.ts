import {SpectronMain} from '../../web/js/test/SpectronMain';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/index.html')
        .catch(err => console.error(err));

});
