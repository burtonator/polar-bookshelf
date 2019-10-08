import {assert} from 'chai';
import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebContentsPromises} from '../../js/electron/framework/WebContentsPromises';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {CachingStreamInterceptorService} from '../../js/backend/interceptor/CachingStreamInterceptorService';
import {BrowserWindow, session, protocol} from 'electron';
import waitForExpect from 'wait-for-expect';
import {SpectronBrowserWindowOptions} from '../../js/test/SpectronBrowserWindowOptions';

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const options = SpectronBrowserWindowOptions.create();

    options.webPreferences!.partition = "persist:test";

    const mainWindow = new BrowserWindow(options);
    mainWindow.loadURL('about:blank');
    return mainWindow;

}

SpectronMain2.create({windowFactory: defaultWindowFactory}).run(async state => {
    //

    const cacheRegistry = new CacheRegistry();

    const sess = session.fromPartition('persist:test');

    // const service = new CachingStreamInterceptorService(cacheRegistry, state.window.webContents.session.protocol);

    // ok.. it looks like the protocol for the sessions is shared between them.

    const service = new CachingStreamInterceptorService(cacheRegistry, sess.protocol);

    await service.start();
    //
    // // add our phz file to the cache registry...

    const path = FilePaths.createTempName("cache-interceptor-service.phz");

    await cacheRegistry.registerFile(path);

    console.log("Interceptor service started...");

    // noinspection TsLint
    const url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";

    const didFinishLoadPromise = WebContentsPromises.once(state.window.webContents).didFinishLoad();

    await await state.window.loadURL(url);

    await didFinishLoadPromise;

    await waitForExpect(() => {
        assert.equal(service.cacheStats.hits, 15, "Invalid number of hits");
    });

    await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});

