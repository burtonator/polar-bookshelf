import {assert} from '@types/chai';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

console.log("Launching spectron renderer");

SpectronRenderer.run(async (state) => {

    console.log("here so far...")

    const content = <Electron.WebviewTag> document.querySelector("#content")!;

    assert.ok(content);

    console.log("we're ok");

    // FIXME: we're not getting this event for dom-ready now...

    content.addEventListener('dom-ready', async () => {

        console.log("dom is ready");

        const webContents = content.getWebContents();

        assert.ok(webContents);

        assert.ok(webContents.id);

        assert.ok(typeof webContents.id === 'number');

        await state.testResultWriter.write(true);

    });


});



