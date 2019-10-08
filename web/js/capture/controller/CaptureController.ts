import {ResourcePaths} from "../../electron/webresource/ResourcePaths";
import {ipcMain} from 'electron';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import BrowserRegistry from '../BrowserRegistry';
import {BrowserProfiles} from '../BrowserProfiles';
import {Capture} from '../Capture';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {CaptureOpts} from '../CaptureOpts';
import {StartCaptureMessage} from './CaptureClient';
import {Directories} from '../../datastore/Directories';
import {CacheRegistry} from '../../backend/proxyserver/CacheRegistry';
import {PHZLoader} from "../../apps/main/file_loaders/PHZLoader";
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";

const log = Logger.create();

export class CaptureController {

    private readonly directories: Directories = new Directories();

    private readonly phzLoader: PHZLoader;

    constructor(private readonly cacheRegistry: CacheRegistry,
                private readonly fileRegistry: FileRegistry) {

        this.phzLoader = new PHZLoader(cacheRegistry, fileRegistry);

    }

    /**
     * Start the service to receive and handle IPC messages.
     */
    public start() {

        ipcMain.on('capture-controller-start-capture', (event: Electron.Event, message: StartCaptureMessage) => {

            this.startCapture(event.sender, message.url)
                .catch( err => log.error("Could not start capture: ", err));

        });

    }

    /**
     *
     * @param webContents {Electron.WebContents} The webContents of the dialog
     * box that started the whole capture.
     *
     * @param url {string}
     */
    protected async startCapture(webContents: Electron.WebContents, url: string) {

        webContents = await this.loadApp(webContents, url);

        const captureResult = await this.runCapture(webContents, url);
        //
        // let captureResult = {
        //     path:
        // "/home/burton/.polar/stash/UK_unveils_new_Tempest_fighter_jet_model___BBC_News.phz"
        // };

        // now load the phz in the target window

        await this.loadPHZ(webContents, captureResult.path);

    }

    private async loadApp(webContents: Electron.WebContents, url: string): Promise<Electron.WebContents> {

        return new Promise<Electron.WebContents>(async resolve => {

            log.debug("Starting capture for URL: " + url);

            const appPath = ResourcePaths.absoluteFromRelativePath('./apps/capture/progress/index.html');
            const appURL = 'file://' + appPath;

            webContents.once("did-finish-load", () => {
                resolve(webContents);
            });

            log.debug("Loading app: ", appURL);

            await webContents.loadURL(appURL);

        });

    }

    /**
     *
     * @param webContents The webContents page that should be updated with our
     * progress.
     *
     * @param url The URL to capture.
     *
     */
    private async runCapture(webContents: Electron.WebContents, url: string) {

        Preconditions.assertNotNull(webContents, "webContents");

        const progressForwarder = new ProgressForwarder({webContents});

        const captureOpts: CaptureOpts = {
            pendingWebRequestsCallback: (event) => progressForwarder.pendingWebRequestsCallback(event),
            amp: true
        };

        const browser = BrowserRegistry.DEFAULT;

        // browser = Browsers.toProfile(browser, "headless");
        // TODO: this should be 'default' not 'hidden'

        // browser = Browsers.toProfile(browser, "default");
        const browserProfile = BrowserProfiles.toBrowserProfile(browser, "WEBVIEW");

        browserProfile.navigation.navigated.dispatchEvent({link: url});
        browserProfile.navigation.captured.dispatchEvent({});

        const capture = new Capture(browserProfile, captureOpts);

        const captureResult = await capture.start();

        log.info("captureResult: ", captureResult);

        return captureResult;

    }

    /**
     *
     * @param webContents {Electron.WebContents}
     * @param path {string} The path to our phz file.
     */
    private async loadPHZ(webContents: Electron.WebContents, path: string) {

        const loadedFile = await this.phzLoader.registerForLoad(path);

        log.debug(`Loading PHZ URL via: `, loadedFile.webResource);

        loadedFile.webResource.loadWebContents(webContents);

    }

}


class ProgressForwarder {

    private readonly webContents: Electron.WebContents;

    constructor(opts: any) {

        this.webContents = opts.webContents;

        Preconditions.assertNotNull(this.webContents, "webContents");

    }

    public pendingWebRequestsCallback(event: PendingWebRequestsEvent) {

        this.webContents.send("capture-progress-update", event);

    }

}
