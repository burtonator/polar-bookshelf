import {BrowserWindow, DownloadItem, WebContents} from 'electron';
import {WebContentsDriver, WebContentsEvent, WebContentsEventName} from './WebContentsDriver';
import {BrowserWindows} from '../BrowserWindows';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {configureBrowser} from '../renderer/ContentCaptureFunctions';
import {Functions} from 'polar-shared/src/util/Functions';
import {BrowserProfile} from '../BrowserProfile';
import {Reactor} from '../../reactor/Reactor';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {WebContentsPromises} from '../../electron/framework/WebContentsPromises';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {ToasterMessages} from '../../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../../ui/toaster/Toaster';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import base = Mocha.reporters.base;
import {PDFImporter} from '../../apps/repository/importers/PDFImporter';
import {FileImportClient} from '../../apps/repository/FileImportClient';
import {ProgressTracker} from '../../util/ProgressTracker';
import {ProgressMessages} from '../../ui/progress_bar/ProgressMessages';
import {AppLauncher} from '../../apps/main/AppLauncher';
import {PDFDownloadHandlers} from '../PDFDownloadHandlers';
import {IDimensions} from "../../util/IDimensions";

const log = Logger.create();

/**
 * Used by the hidden and headless driver.
 */
export class StandardWebContentsDriver implements WebContentsDriver {

    public webContents?: WebContents;

    public browserProfile: BrowserProfile;

    protected browserWindow?: BrowserWindow;

    protected reactor = new Reactor<WebContentsEvent>();

    constructor(browserProfile: BrowserProfile) {
        this.browserProfile = browserProfile;
    }

    public async init(webContents?: WebContents) {

        const browserWindowOptions = this.computeBrowserWindowOptions();

        await this.doInit(browserWindowOptions);

    }


    public async getWebContents(): Promise<Electron.WebContents> {
        return Optional.of(this.webContents).get();
    }

    public async destroy() {
        log.info("Destroying window...");

        Optional.of(this.browserWindow)
            .map(browserWindow => {

                if (!browserWindow.isDestroyed()) {
                    browserWindow.close();
                }

            });

        log.info("Destroying window...done");
    }

    /**
     *
     * @param url The URL to load.
     *
     * @param waitForFinishLoad When true, wait for the 'did-finish-load' event
     * which is the default since the old capture system was based on the
     *     browser loading event stream and we assumed the load event would
     *     mean the page was finished rendering - which is not really true.
     */
    public async loadURL(url: string, waitForFinishLoad: boolean = true): Promise<void> {

        const opts = {

            // the no-cache header is needed here so that we don't load the data
            // into the cache and then accidentally load it.
            // extraHeaders: `pragma: no-cache, no-store\nreferer: ${url}\n`,
            extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
            userAgent: this.browserProfile.userAgent

        };

        const result = WebContentsPromises.once(this.webContents!).didFinishLoad();

        await this.webContents!.loadURL(url, opts)

        if (waitForFinishLoad) {
            return result;
        } else {
            return Promise.resolve();
        }

    }

    public progressUpdated(event: PendingWebRequestsEvent): void {
    }

    public addEventListener(eventName: WebContentsEventName, eventListener: () => void): void {
        this.reactor.addEventListener(eventName, eventListener);
    }

    protected computeBrowserWindowOptions() {
        return BrowserWindows.toBrowserWindowOptions(this.browserProfile);
    }

    protected async doInit(browserWindowOptions: BrowserWindowConstructorOptions) {

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        const window = new BrowserWindow(browserWindowOptions);

        await this.initWebContents(window, window.webContents, browserWindowOptions);

        this.initReactor();

    }

    protected async initWebContents(browserWindow: BrowserWindow,
                                    webContents: WebContents,
                                    browserWindowOptions: BrowserWindowConstructorOptions) {

        this.browserWindow = browserWindow;
        this.webContents = webContents;

        await this.initWebContentsEvents(webContents);

        if ( ! browserWindowOptions.show) {
            await BrowserWindows.onceReadyToShow(browserWindow);
        }

        await StandardWebContentsDriver.configureWebContents(webContents, this.browserProfile);

    }

    private async initWebContentsEvents(webContents: WebContents) {


        const onDownloadedHandler = () => {

            this.destroy()
                .catch(err => log.error(err));

        };

        const onDownloadHandler = () => {

            let rootWebContents = webContents;

            while (rootWebContents.hostWebContents) {
                rootWebContents = rootWebContents.hostWebContents;
            }

            const browserWindowID = rootWebContents.id;

            log.info("Getting BrowserWindow from ID: " + browserWindowID);

            const browserWindow = BrowserWindow.fromId(browserWindowID);

            if (browserWindow) {
                browserWindow.close();
            } else {
                log.warn("No browser window to clsoe");
            }

            AppLauncher.launchRepositoryApp()
                .catch(err => log.error(err));

        };

        PDFDownloadHandlers.create(webContents, () => onDownloadedHandler(), () => onDownloadHandler());

        webContents.on('dom-ready', (e) => {

            log.info("dom-ready: ", e);

            StandardWebContentsDriver.configureWebContents(webContents, this.browserProfile)
                .catch((err: Error) => log.error("Could not configure web contents: ", err));

        });

        webContents.on('will-navigate', (e, url) => {
            // log.info("Canceling navigation...");
            // e.preventDefault();
        });

        webContents.on('did-fail-load', (event, errorCode, errorDescription, validateURL, isMainFrame) => {
            log.info("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);
        });

    }

    public static async configureWebContents(webContents: WebContents, browserProfile: BrowserProfile) {

        const url = webContents.getURL();

        log.info("Configuring webContents with URL: " + url);

        // we need to mute by default especially if the window is hidden.
        log.info("Muting audio...");
        webContents.setAudioMuted(! browserProfile.webaudio);

        let deviceEmulation = browserProfile.deviceEmulation;

        deviceEmulation = Object.assign({}, deviceEmulation);

        log.info("Emulating device...");
        webContents.enableDeviceEmulation(deviceEmulation);

        webContents.setUserAgent(browserProfile.userAgent);

        const windowDimensions: IDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: ", windowDimensions);

        const configureBrowserScript = Functions.functionToScript(configureBrowser, windowDimensions);

        await webContents.executeJavaScript(configureBrowserScript);

    }

    protected initReactor() {

        log.info("Initializing reactor for 'close'");

        this.reactor.registerEvent('close');

        this.browserWindow!.on('close', () => {
            log.info("Firing event listener 'close'");
            this.reactor.dispatchEvent('close', {});
        });

    }

}
