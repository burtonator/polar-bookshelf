import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {CacheInterceptorService} from '../../js/backend/interceptor/CacheInterceptorService';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebContentsPromises} from '../../js/electron/framework/WebContentsPromises';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

SpectronMain2.create().run(async state => {
    //
    const cacheRegistry = new CacheRegistry();

    const cacheInterceptorService = new CacheInterceptorService(cacheRegistry);

    await cacheInterceptorService.start();
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

    await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});

