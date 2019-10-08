import {assert, expect} from '@types/chai';
import {webContents} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import waitForExpect from 'wait-for-expect';
import {BrowserWindows} from '../../js/electron/framework/BrowserWindows';
import {BrowserWindow} from 'electron';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';
import {WindowFactory} from '../../js/test/SpectronMain';
import {app} from 'electron';
//
// SpectronMain.run(async state => {
//
//     console.log("FIXME: loading...");
//
//     await state.window.loadFile(__dirname + '/app.html');
//     console.log("FIXME: loded: " + state.window.webContents.getURL());
//
//     // the only other way to get the WebContents from a Webview
//     // is from the renderer via
//     //
//     // let webView = webFrame.getFrameForSelector('webview');
//
//     await waitForExpect(() => {
//         assert.equal(webContents.getAllWebContents().length, 2);
//     });
//
//     const allWebContents = webContents.getAllWebContents();
//
//     assert.ok(webContents.fromId(allWebContents[0].id));
//     assert.ok(webContents.fromId(allWebContents[1].id));
//
//     await waitForExpect(() => {
//
//         const links = allWebContents.map(current => current.getURL()).sort();
//
//         expect(links[0]).to.satisfy((current: string) => current.endsWith('/app.html'));
//         expect(links[1]).to.satisfy((current: string) => current.endsWith('/example.html'));
//
//     });
//
//     const webContentsHostIndex = BrowserWindows.computeWebContentsToHostIndex();
//
//     assert.equal(webContentsHostIndex.keys.length, 1);
//
//     await state.testResultWriter.write(true);
//
// });


const windowFactory: WindowFactory = async () => {
    const result = new BrowserWindow(SpectronBrowserWindowOptions.create());
    await result.loadURL('about:blank');
    return result;
};

async function test() {

    app.on('ready', async () => {

        const window = await windowFactory();
        console.log("FIXME: showing...");
        window.show();
        console.log("FIXME: showing...done");

        await window.loadFile(__dirname + '/app.html');

    });
}

test()
    .catch(err => console.error(err));
