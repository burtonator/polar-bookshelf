import {BrowserWindow} from "electron";
import {APP_ICON, MainAppBrowserWindowFactory} from '../main/MainAppBrowserWindowFactory';

const WIDTH = 800 * 1.2;
const HEIGHT = 1100 * 1.2;

export const BROWSER_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = {
    backgroundColor: '#FFF',
    minWidth: WIDTH * 0.4,
    minHeight: HEIGHT * 0.4,
    width: WIDTH,
    height: HEIGHT,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions

    // TODO: the AppIcon CAN be a file URL
    icon: APP_ICON,
    webPreferences: {

        // NOTE: these must be disabled because they break pdf.js.  It must be
        // some change to require() from their workers.  So maybe I just can't
        // use workers for now.
        // nodeIntegrationInWorker: true,
        //
        // sandbox: false,

        defaultEncoding: 'UTF-8',

        webaudio: true,

        nodeIntegration: false,

        // zoomFactor: 1.0

        /**
         * Use a persistent cookie session between restarts.  This is used so
         * that we keep user cookies including Google Analytics cookies.
         */
        partition: 'persist:polar-app'
    }

};

/**
 * Window factory for creating windows for the browser app which allows us
 * to easily try new settings.
 */
export class BrowserAppWindowFactory {

    public static createWindow(url: string): Promise<BrowserWindow> {
        return MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);
    }

}
