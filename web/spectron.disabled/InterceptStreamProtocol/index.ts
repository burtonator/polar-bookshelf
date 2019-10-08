import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebContentsPromises} from '../../js/electron/framework/WebContentsPromises';
import {Protocols} from '../../js/backend/interceptor/Protocols';
import {StreamInterceptors} from '../../js/backend/interceptor/StreamInterceptors';
import {protocol} from 'electron';

SpectronMain2.create().run(async state => {

    for (const scheme of ['http', 'https']) {

        await Protocols.interceptStreamProtocol(protocol, scheme, (request, callback) => {

            StreamInterceptors.withSetTimeout(() => {
                StreamInterceptors.handleWithNetRequest(request, callback);
            });

        });

    }

    const url = "http://www.example.com";

    const didFinishLoadPromise = WebContentsPromises.once(state.window.webContents).didFinishLoad();

    await state.window.loadURL(url);

    await didFinishLoadPromise;

    await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});
