
// Investigate this as a way to adjust the screen size automatically:

// useContentSize Boolean (optional) - The width and height would be used as web
// page's size, which means the actual window's size will include window frame's
// size and be slightly larger. Default is false.

import {ResourcePaths} from '../electron/webresource/ResourcePaths';
import {Logger} from 'polar-shared/src/logger/Logger';
import {BrowserProfile} from './BrowserProfile';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import BrowserWindow = Electron.BrowserWindow;

const log = Logger.create();

export class BrowserWindows {

    public static toBrowserWindowOptions(browserProfile: BrowserProfile): BrowserWindowConstructorOptions {

        const partition = "part-" + Date.now();

        return {
            minWidth: browserProfile.deviceEmulation.screenSize.width,
            minHeight: browserProfile.deviceEmulation.screenSize.height,
            width: browserProfile.deviceEmulation.screenSize.width,
            height: browserProfile.deviceEmulation.screenSize.height,
            // maxWidth: WIDTH,
            // maxHeight: HEIGHT,
            show: browserProfile.show,

            // Enable the window to be resized larger than screen. Default is false.
            enableLargerThanScreen: true,

            webPreferences: {

                // the path to our content capture bundle needs to be absolute
                // for some strange reason and this is required by Electron.
                // preload,

                nodeIntegration: browserProfile.nodeIntegration,

                defaultEncoding: 'UTF-8',

                webaudio: browserProfile.webaudio,

                offscreen: browserProfile.offscreen,

                /**
                 * This is needed for now because we have to access the iframe
                 * content from the frame and that might not be possible
                 * otherwise. There is not necessarily anything to steal here
                 * yet as we're not using any type of cookie sharing but we
                 * might in the future so need to be careful here.  As soon as
                 * we can get access to the iframe documents from electron we
                 * should move to a more secure solution.
                 */
                webSecurity: false,

                /**
                 * Use a session per capture so that webRequests between capture
                 * instances aren't shared.
                 */
                partition,

                webviewTag: true

            }

        };

    }

    public static async onceReadyToShow(window: BrowserWindow): Promise<BrowserWindow> {

        return new Promise<BrowserWindow>(resolve => {

            window.once('ready-to-show', () => {
                return resolve(window);
            });

        });

    }

}
