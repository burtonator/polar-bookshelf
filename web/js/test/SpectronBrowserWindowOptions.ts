import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

import process from 'process';

const SPECTRON_SHOW = 'SPECTRON_SHOW';

const offscreen = process.env.SPECTRON_OFFSCREEN === 'true';
const show = !offscreen;

console.log("Running with spectron config: ", {offscreen, show});

export class SpectronBrowserWindowOptions {

    public static create(): BrowserWindowConstructorOptions {

        // Determine whether we should show the window by default. Normally
        // showing the window is really annoying when developing locally but
        // for debug purposes it's nice to actually show them.

        // NOT showing by default because on windows, and other platforms, the
        // procs are often stuck so I need to figure that part out.

        return {

            backgroundColor: '#FFF',

            // NOTE: the default width and height shouldn't be changed here as it can
            // break unit tests.

            // width: 1000,
            // height: 1000,

            show,

            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                partition: "persist:spectron",
                webviewTag: true,
                offscreen
            }

        };

    }

}
