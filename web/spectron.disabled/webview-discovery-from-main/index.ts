import {assert, expect} from '@types/chai';
import {webContents} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import waitForExpect from 'wait-for-expect';

SpectronMain.run(async state => {

    await state.window.loadFile(__dirname + '/app.html');

    // the only other way to get the WebContents from a Webview
    // is from the renderer via
    //
    // let webView = webFrame.getFrameForSelector('webview');

    await waitForExpect(() => {
        assert.equal(webContents.getAllWebContents().length, 2);
    });

    const allWebContents = webContents.getAllWebContents();

    assert.ok(webContents.fromId(allWebContents[0].id));
    assert.ok(webContents.fromId(allWebContents[1].id));

    await waitForExpect(() => {

        const links = allWebContents.map(current => current.getURL()).sort();

        expect(links[0]).to.satisfy((current: string) => current.endsWith('/app.html'));
        expect(links[1]).to.satisfy((current: string) => current.endsWith('/example.html'));

    });

    // const webContentsHostIndex = BrowserWindows.computeWebContentsToHostIndex();
    //
    // assert.equal(webContentsHostIndex.keys.length, 1);
    //
    await state.testResultWriter.write(true);

});

