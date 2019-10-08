import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Messenger} from '../../js/electron/messenger/Messenger';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Injector} from 'injector';

SpectronMain2.create().run(async state => {

    await state.window.loadURL(`file://${__dirname}/content.html`);

    const path = FilePaths.join(__dirname, "content.js");
    Injector.inject(state.window, path);

});



