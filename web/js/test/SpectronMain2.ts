import {app, BrowserWindow} from 'electron';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SpectronBrowserWindowOptions} from './SpectronBrowserWindowOptions';
import {Preconditions} from 'polar-shared/src/Preconditions';

const log = Logger.create();

/**
 * Code for reliably working with the main process in Spectron.  Waits for app
 * 'ready', sets up windows, etc.
 */
export class SpectronMain2 {

    private readonly options: Readonly<ISpectronMainOptions>;

    private constructor(options: Readonly<ISpectronMainOptions>) {
        this.options = options;
    }

    /**
     * Create a window using the current window constructor function.
     */
    public async createWindow(): Promise<BrowserWindow> {
        return await this.options.windowFactory();
    }

    public setup(): Promise<BrowserWindow> {

        Preconditions.assertPresent(app, "No app");

        return new Promise(resolve => {

            app.on('ready', async () => {

                log.info("Ready!  Creating main window!!");

                const mainWindow = await this.options.windowFactory();

                log.info("Done.. resolving");
                resolve(mainWindow);

            });

        });

    }

    public async start(callback: StateCallback): Promise<void> {
        const window = await this.setup();
        const testResultWriter = new MainTestResultWriter(window);

        return callback(new SpectronMainState(this, window, testResultWriter));

    }

    /**
     * Like start but not async and assume this is the entry point of your test
     * and just print error messages to the console.
     */
    public run(callback: StateCallback) {
        this.start(callback)
            .catch(err => log.error("Could not run spectron:", err));
    }

    public static create(options: ISpectronMainOptions = new SpectronMainOptions().build()) {
        return new SpectronMain2(options);
    }

}

async function defaultWindowFactory(): Promise<BrowserWindow> {
    const options = SpectronBrowserWindowOptions.create();
    console.log("Creating window with options: ", options);

    const mainWindow = new BrowserWindow(options);
    // mainWindow.webContents.toggleDevTools();
    await mainWindow.loadURL('about:blank');

    return mainWindow;
}

export class SpectronMainState {

    public readonly spectronMain: SpectronMain2;

    public readonly window: BrowserWindow;

    public readonly testResultWriter: MainTestResultWriter;

    constructor(spectronMain: SpectronMain2, window: BrowserWindow, testResultWriter: MainTestResultWriter) {
        this.spectronMain = spectronMain;
        this.window = window;
        this.testResultWriter = testResultWriter;
    }

    /**
     * Create a window with the same WindowFactory that SpectronMain is using.
     */
    public async createWindow() {
        return this.spectronMain.createWindow();
    }

}

export class SpectronMainOptions implements ISpectronMainOptions {

    public windowFactory: WindowFactory = defaultWindowFactory;

    /**
     * True to automatically start dev tools on each window when using the
     * default window factory.
     */
    public enableDevTools = false;

    public build(): Readonly<SpectronMainOptions> {
        return Object.freeze(this);
    }

}

export interface ISpectronMainOptions {

    windowFactory: WindowFactory;

    /**
     * True to automatically start dev tools on each window when using the
     * default window factory.
     */
    enableDevTools?: boolean;
}

export type StateCallback = (state: SpectronMainState) => Promise<void>;

export type WindowFactory = () => Promise<BrowserWindow>;
