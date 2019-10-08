import {SpectronMain, WindowFactory} from '../../web/js/test/SpectronMain';
import {Logging} from '../../web/js/logger/Logging';
import {CaptureController} from '../../web/js/capture/controller/CaptureController';
import {CacheRegistry} from '../../web/js/backend/proxyserver/CacheRegistry';
import {BrowserWindow} from "electron";
import BrowserRegistry from '../../web/js/capture/BrowserRegistry';
import {BrowserProfiles} from '../../web/js/capture/BrowserProfiles';
import {Capture} from '../../web/js/capture/Capture';

//
// const windowFactory: WindowFactory = async () => {
//
//     await Logging.init();
//
//     const webserverConfig = new WebserverConfig();
//
//     const cacheRegistry = new CacheRegistry();
//     const fileRegistry = new FileRegistry(webserverConfig);
//
//     const captureController = new CaptureController(cacheRegistry, fileRegistry);
//
//     captureController.start();
//
//     const browser = BrowserRegistry.DEFAULT;
//
//     const browserProfile = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT');
//
//     const capture = new Capture(browserProfile);
//
//     capture.start()
//         .catch(err => console.error(err));
//
//     return BrowserWindow.getFocusedWindow()!;
//
// };
//
// SpectronMain.run(async state => {
//
//     await state.testResultWriter.write(true);
//
// }, { windowFactory });
//
//
