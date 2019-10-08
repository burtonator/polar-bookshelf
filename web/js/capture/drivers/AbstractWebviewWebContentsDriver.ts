import {Logger} from 'polar-shared/src/logger/Logger';
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {ResourcePaths} from '../../electron/webresource/ResourcePaths';
import {notNull} from 'polar-shared/src/Preconditions';
import {BrowserWindows} from '../BrowserWindows';
import {BrowserWindow} from "electron";
import {Functions} from 'polar-shared/src/util/Functions';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {BrowserProfile} from '../BrowserProfile';
import {WebContentsNotifier} from '../../electron/web_contents_notifier/WebContentsNotifier';
import {MainIPCEvent} from '../../electron/framework/IPCMainPromises';
import {BrowserAppEvent} from '../../apps/browser/BrowserAppEvent';
import {Browser} from '../Browser';
import {BrowserProfiles} from '../BrowserProfiles';
import WebContents = Electron.WebContents;

const log = Logger.create();

/**
 * A driver which creates an app that uses a <webview> host control for our
 * content.
 */
export abstract class AbstractWebviewWebContentsDriver extends StandardWebContentsDriver {

    private readonly appPath: string;

    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    private browserView?: BrowserView;

    protected constructor(browserProfile: BrowserProfile, appPath: string) {
        super(browserProfile);
        this.appPath = appPath;
    }

    public async init() {

        await this.doInit();

        // TODO: this might actually NOT be needed now or we could refactor
        // this to load as part of the GuestBrowserView setup..
        await this.doInitWebview();

    }

    protected async waitForWebview(): Promise<WebContents> {

        return new Promise<WebContents>(resolve => {
            this.browserWindow!.webContents.once('did-attach-webview', (event, newWebContents: WebContents) => {
                resolve(newWebContents);
            });
        });

    }


    public progressUpdated(event: PendingWebRequestsEvent): void {

    }

    /**
     * doInit method for creating the window which differs from the
     * StandardWebContentsDriver in that we have to have the parent window
     * a reasonably browser height and the webview content the ACTUAL height.
     */
    protected async doInit() {

        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        const hostBrowserWindowOptions = this.computeHostBrowserWindowOptions();

        log.info("Using hostBrowserWindowOptions: ", hostBrowserWindowOptions);

        this.browserWindow = new BrowserWindow(hostBrowserWindowOptions);
        this.webContents = this.browserWindow.webContents;

        const hostBrowserView = new HostBrowserView(this, this.browserWindow);
        const guestBrowserView = new GuestBrowserView(this, this.browserWindow);

        this.browserView =
            new DelegatedBrowserView([hostBrowserView, guestBrowserView]);

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvent.PROVIDE_URL,
                               (event: MainIPCEvent<string>) => {

            const link = event.message;

            log.info("Got link for navigation: " + link);
            this.browserProfile.navigation.navigated.dispatchEvent({link});

        });

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvent.TRIGGER_CAPTURE,
                               (event: MainIPCEvent<void>) => {

           log.info("Got content capture click");
           this.browserProfile.navigation.captured.dispatchEvent({});

        });

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvent.CONFIGURE_WINDOW,
                               (event: MainIPCEvent<Browser>) => {

            const browser = event.message;

            log.info("Changing browser to: ", browser);

            const navigation = this.browserProfile.navigation;
            this.browserProfile = BrowserProfiles.toBrowserProfile(browser, this.browserProfile.profile);
            // need to preserve the navigation object so that notifications
            // work properly.
            this.browserProfile =
                Object.freeze(
                    Object.assign({}, this.browserProfile, {navigation}));

            this.browserWindowOptions = this.computeHostBrowserWindowOptions();

            log.info("Changing browser profile to: ", this.browserProfile);

            this.browserView!.configure(this.browserProfile)
                .catch((err: Error) => log.error("Unable to configure: ", err));

        });

        this.initReactor();

    }

    protected async handleConfigureWindow() {

        log.info("Changing browser profile to: ", this.browserProfile);

        await StandardWebContentsDriver.configureWebContents(this.webContents!, this.browserProfile);
        await this.doInitGuestWebviewDimensions();

    }

    protected async doInitWebview() {

        const window = notNull(this.browserWindow);

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        const resourceURL = ResourcePaths.resourceURLFromRelativeURL(this.appPath);

        await window.loadURL(resourceURL);
            // .catch(err => console.error(err));

        // THIS is our guest webview that we should be using.
        this.webContents = await this.waitForWebview();

        await this.initWebContents(this.browserWindow!, this.webContents, this.browserWindowOptions!);

        // await this.configureWebContents(this.webContents);

        await this.doInitGuestWebviewDimensions();

    }

    protected computeHostBrowserWindowOptions() {

        // Create the browser window.
        const browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        if (this.browserProfile.hosted) {
            // increase our hosted browser slightly
            browserWindowOptions.width = notNull(browserWindowOptions.width) * 1.35;
        }

        browserWindowOptions.height = Math.round(notNull(browserWindowOptions.width) * (11 / 8.5));
        browserWindowOptions.minHeight = (browserWindowOptions.height / 2);

        // TODO: make this part of the profile.
        browserWindowOptions.enableLargerThanScreen = false;
        // browserWindowOptions.webPreferences!.zoomFactor = 1.0

        return browserWindowOptions;

    }

    protected getBrowserWindow(): BrowserWindow | undefined {
        return this.browserWindow;
    }

    private async doInitGuestWebviewDimensions() {

        const window = notNull(this.browserWindow);

        // @ElectronRendererContext
        // noinspection TsLint: no-shadowed-variable
        function setWebviewDimensions(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

            const querySelector = <HTMLElement> document.querySelector('webview')!;

            // console.log("browserWindowOptions: ", browserWindowOptions);

            querySelector.style.height = `${browserWindowOptions.height}px`;
            querySelector.style.width = `${browserWindowOptions.width}px`;

        }

        await window.webContents.executeJavaScript(Functions.functionToScript(setWebviewDimensions, this.browserWindowOptions));

    }

}

interface BrowserView {
    configure(browserProfile: BrowserProfile): Promise<void>;
}

class DelegatedBrowserView implements BrowserView {

    private readonly delegates: BrowserView[];

    constructor(delegates: BrowserView[]) {
        this.delegates = delegates;
    }

    public async configure(browserProfile: BrowserProfile): Promise<void> {

        for (const delegate of this.delegates) {

            delegate.configure(browserProfile)
                .catch(err => log.error("Unable to configure for browser profile: ", browserProfile));

        }

    }

}

class HostBrowserView implements BrowserView {

    private readonly driver: AbstractWebviewWebContentsDriver;
    private readonly window: BrowserWindow;

    private browserProfile?: BrowserProfile;
    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    constructor(driver: AbstractWebviewWebContentsDriver,
                window: Electron.BrowserWindow) {
        this.driver = driver;
        this.window = window;

    }

    public async configure(browserProfile: BrowserProfile) {

        this.browserProfile = browserProfile;
        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile!);

        await this.doInitGuestWebviewDimensions();
        this.changeWindowSize();
    }

    /**
     * This configures the <webview> element width and height properly.
     */
    private async doInitGuestWebviewDimensions() {

        const window = notNull(this.window);

        // change the size of the <webview> element

        // @ElectronRendererContext
        // noinspection TsLint: no-shadowed-variable
        function setWebviewDimensions(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

            const querySelector = <HTMLElement> document.querySelector('webview')!;

            querySelector.style.height = `${browserWindowOptions.height}px`;
            querySelector.style.width = `${browserWindowOptions.width}px`;

        }

        const script = Functions.functionToScript(setWebviewDimensions, this.browserWindowOptions);

        await this.window.webContents.executeJavaScript(script);

    }

    private changeWindowSize() {

        const width = this.browserWindowOptions!.width! + 50;
        const height = this.window.getSize()[1];

        this.window.setSize(width, height);
    }


}

class GuestBrowserView implements BrowserView {

    private readonly driver: AbstractWebviewWebContentsDriver;
    private readonly window: BrowserWindow;

    private browserProfile?: BrowserProfile;
    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    private webContents?: WebContents;

    // the nuimber of times this page has been configured.
    private nrConfigured = 0;

    constructor(driver: AbstractWebviewWebContentsDriver,
                window: Electron.BrowserWindow) {

        this.driver = driver;
        this.window = window;

        this.waitForWebContents()
            .then((webContents) => {
                this.webContents = webContents;
            })
            .catch(err => log.error("Unable to get guest webview: ", err));


    }

    public async configure(browserProfile: BrowserProfile) {

        this.browserProfile = browserProfile;
        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile!);

        // this configures the guest web contents which loads the website we're
        // capturing and tells it about browser emulation, width, etc.
        await StandardWebContentsDriver.configureWebContents(this.webContents!, browserProfile);

        if (this.nrConfigured > 0) {
            log.info("Reloading page after configure");
            this.webContents!.reload();
        }

        ++this.nrConfigured;
    }

    private async waitForWebContents() {

        return new Promise<WebContents>(resolve => {
            this.window!.webContents.once('did-attach-webview', (event, newWebContents: WebContents) => {
                resolve(newWebContents);
            });
        });

    }

}
