import {assert} from 'chai';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {MainIPCEvent} from '../../js/electron/framework/IPCMainPromises';
import {WebContentsNotifier} from '../../js/electron/web_contents_notifier/WebContentsNotifier';

SpectronMain2.create().run(async state => {

    const helloPromise: Promise<MainIPCEvent<string>>
        = WebContentsNotifier.once(state.window.webContents, 'hello');

    await await state.window.loadURL(`file://${__dirname}/app.html`);

    const mainIPCEvent = await helloPromise;

    assert.equal(mainIPCEvent.message, 'world');

    await state.testResultWriter.write(true);

});
