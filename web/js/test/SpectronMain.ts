import {app, BrowserWindow} from 'electron';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';
import {SpectronBrowserWindowOptions} from './SpectronBrowserWindowOptions';

/**
 * Code for reliably working with the main process in Spectron.
 */
export class SpectronMain {

    public static setup(options?: SpectronMainOptions): Promise<Electron.BrowserWindow> {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async function() {

                console.log("Ready!  Creating main window!!");

                let windowFactory: WindowFactory = async () => {
                    const result = new BrowserWindow(SpectronBrowserWindowOptions.create());
                    await result.loadURL('about:blank')
                    return result;
                };

                if (options && options.windowFactory) {
                    windowFactory = options.windowFactory;
                }

                const mainWindow = await windowFactory();

                console.log("Done.. resolving");
                resolve(mainWindow);

            });

        });

    }

    public static async start(callback: StateCallback, options?: SpectronMainOptions): Promise<void> {

        const window = await SpectronMain.setup(options);
        const testResultWriter = new MainTestResultWriter(window);

        return callback(new SpectronMainState(window, testResultWriter));

    }

    /**
     * Like start but not async and assume this is the entry point of your test
     * and just print error messages to the console.
     */
    public static run(callback: StateCallback, options?: SpectronMainOptions) {
        SpectronMain.start(callback, options)
            .catch(err => console.log("Caught error running spectron: ", err));
    }


}

export class SpectronMainState {

    public readonly window: BrowserWindow;

    public readonly testResultWriter: MainTestResultWriter;

    constructor(window: Electron.BrowserWindow, testResultWriter: MainTestResultWriter) {
        this.window = window;
        this.testResultWriter = testResultWriter;
    }

}

export interface SpectronMainOptions {

    readonly windowFactory?: WindowFactory;

}

export interface StateCallback {
    (state: SpectronMainState): Promise<void>;
}

export interface WindowFactory {
    (): Promise<BrowserWindow>;
}

