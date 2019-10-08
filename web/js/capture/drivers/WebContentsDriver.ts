import WebContents = Electron.WebContents;
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {CaptureWebviewWebContentsDriver} from './CaptureWebviewWebContentsDriver';
import {BrowserWebContentsDriver} from './BrowserWebContentsDriver';

export interface WebContentsDriver {

    readonly browserProfile: BrowserProfile;

    /**
     *
     */
    init(): Promise<void>;

    getWebContents(): Promise<WebContents>;

    /**
     *
     */
    destroy(): void;

    loadURL(url: string): Promise<void>;

    /**
     * Called when progress for the loading page has been updated.
     */
    progressUpdated(event: PendingWebRequestsEvent): void;

    /**
     * Allows us to listen to close, etc.
     */
    addEventListener(eventName: WebContentsEventName, eventListener: () => void): void;

}

export class WebContentsDriverFactory {

    public static async create(browserProfile: BrowserProfile): Promise<WebContentsDriver> {

        let webContentsDriver: WebContentsDriver;

        if (browserProfile.profile === DriverType.WEBVIEW) {
            webContentsDriver = new CaptureWebviewWebContentsDriver(browserProfile);
        } else if (browserProfile.profile === DriverType.BROWSER) {
            webContentsDriver = new BrowserWebContentsDriver(browserProfile);
        } else {
            webContentsDriver = new StandardWebContentsDriver(browserProfile);
        }

        await webContentsDriver.init();
        return webContentsDriver;
    }

}

export enum DriverType {

    HEADLESS = 'HEADLESS',

    HIDDEN = 'HIDDEN',

    // a hidden page with a hosted webview control.
    WEBVIEW = 'WEBVIEW',

    // a full browser view that enables the user to click a capture button and
    // interact with the page.

    BROWSER = 'BROWSER',

}

export type WebContentsEventName = 'close';

export interface WebContentsEvent {

}
