import {ScreenshotDelegate} from './ScreenshotDelegate';

declare var global: any;

/**
 * Service that runs in the Electron main context which listens to IPC events
 * and performs screenshots on windows when requested.
 *
 * The ScreenshotsService must be started in the main process or messages will
 * never be returned.
 *
 * @ElectronMainContext - Must be run from the electron main context.
 */
export class ScreenshotService {

    public start() {

        const screenshotDelegate = new ScreenshotDelegate();

        if (global[ScreenshotDelegate.DELEGATE_NAME]) {
            throw new Error("Object named screenshotDelegate already in global");
        }

        global[ScreenshotDelegate.DELEGATE_NAME] = screenshotDelegate;

    }

}
