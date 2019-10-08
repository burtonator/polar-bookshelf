import {BrowserWindow} from 'electron';
import {app} from 'electron';
import {WindowFactory} from '../../js/test/SpectronMain';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';


const windowFactory: WindowFactory = async () => {
    const result = new BrowserWindow(SpectronBrowserWindowOptions.create());
    await result.loadURL('about:blank');
    return result;
};

async function test() {

    app.on('ready', async () => {

        const window = await windowFactory();
        window.show();

        await window.loadFile(__dirname + '/app.html');

    });
}

test()
    .catch(err => console.error(err));
