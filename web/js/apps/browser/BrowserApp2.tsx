import {Logger} from 'polar-shared/src/logger/Logger';
import {WebContentsNotifiers} from '../../electron/web_contents_notifier/WebContentsNotifiers';
import {BrowserAppEvent} from './BrowserAppEvent';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {BrowserNavBar} from './react/BrowserNavBar';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';
import {isPresent} from 'polar-shared/src/Preconditions';
import BrowserRegistry from '../../capture/BrowserRegistry';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {ProgressBar} from '../../ui/progress_bar/ProgressBar';
import {BackgroundFrameResizer} from '../../viewer/html/BackgroundFrameResizer';
import {URLs} from 'polar-shared/src/util/URLs';
import {Strings} from "polar-shared/src/util/Strings";

const log = Logger.create();

export class BrowserApp2 {

    /**
     * Truen when the user has loaded an external URL.
     */
    private loadedURL: boolean = false;

    private webviewNavigated: boolean = false;

    private progressBar: ProgressBar | undefined;

    public async start() {

        await DocumentReadyStates.waitFor(document, 'complete');

        const navigationReactor = new SimpleReactor<NavigationEvent>();

        ReactDOM.render(
            <BrowserNavBar onLoadURL={(url) => this.onLoadURL(url)}
                           onBrowserChanged={(browserName: string) => this.onBrowserChanged(browserName)}
                           onTriggerCapture={() => this.onTriggerCapture()}
                           onReload={() => this.onReload()}
                           navigationReactor={navigationReactor} />,
            document.getElementById('browser-navbar-parent') as HTMLElement
        );

        const content = this.getContentHost();

        content.addEventListener('dom-ready', async () => {

            content.insertCSS('html, body { overflow: hidden !important; }');


            ['did-start-loading', 'did-stop-loading', 'did-fail-load', 'dom-ready' ]
                .map(eventListenerName => content.addEventListener(eventListenerName, () => this.refreshTitle(eventListenerName)));

            content.getWebContents().addListener('will-navigate', (event, url) => {
                log.debug("WebContents event: will-navigate: " + url);
                this.onWebviewNavigated(url, 'will-navigate');

            });

            const onDidStartNavigation = (eventName: string, url: string, isMainPage: boolean) => {

                const context = {eventName, url, isMainPage};

                log.debug(`${eventName}`, context);

                if (this.webviewNavigated) {
                    log.debug(`${eventName}: already called for eventName `, context);
                    return;
                }

                // TODO: refactor this so it only works on the top level
                // navigation changes but we weren't able to do this because
                // the event we're receiving is generic.

                const currentURL = content.getURL();

                if (Strings.empty(currentURL)) {
                    log.debug(`${eventName}: empty URL: `, context);
                    return;
                }

                if (! URLs.isWebScheme(currentURL)) {
                    log.debug(`${eventName}: not a web URL: `, context);
                    return;
                }

                if (!isMainPage) {
                    log.debug(`${eventName}: not the main page: `, context);
                    return;
                }

                this.onWebviewNavigated(currentURL, eventName);

                log.info("Dispatching navigation reactor event for did-start-loading: " + currentURL);
                navigationReactor.dispatchEvent({url: currentURL, type: 'did-start-loading'});

                this.webviewNavigated = true;

            };

            // content.getWebContents().addListener('did-start-navigation', (event, url, isInPlace, isMainFrame) => {
            //
            //     onDidStartNavigation('did-start-navigation', url, isMainFrame);
            //
            // });

            content.getWebContents()
                .addListener('did-frame-finish-load', (event: Electron.Event,
                                                       isMainFrame: boolean,
                                                       frameProcessId: number,
                                                       frameRoutingId: number) => {

                    const eventName = 'did-frame-finish-load';

                    log.debug(`${eventName}: isMainFrame: ${isMainFrame}: ` + content.getURL());

                    if (!isMainFrame) {
                        log.debug(`${eventName}: skipping (not main frame)`);
                        return;
                    }

                    if (! this.loadedURL) {
                        log.debug(`${eventName}: skipping (URL not loaded)`);
                        return;
                    }

                    if (! this.webviewNavigated) {
                        log.debug(`${eventName}: skipping (webview not navigated)`);
                        return;
                    }

                    if (this.progressBar) {
                        log.debug(`${eventName}: destroying progeress bar`);
                        this.progressBar.destroy();
                    }

                    const currentURL = content.getURL();

                    navigationReactor.dispatchEvent({url: currentURL, type: 'did-stop-loading'});

                });

            content.addEventListener('did-fail-load', () => {
                log.warn("Load of URL failed.");
            });

            this.forwardConsoleMessages(content);

        });

    }

    private forwardConsoleMessages(content: Electron.WebviewTag) {

        content.addEventListener('console-message', (consoleMessageEvent: Electron.ConsoleMessageEvent) => {

            const prefix = 'WEBVIEW: ';

            switch (consoleMessageEvent.level) {

                case -1:
                    console.debug(prefix + consoleMessageEvent.message);
                    break;

                case 0:
                    console.info(prefix + consoleMessageEvent.message);
                    break;

                case 1:
                    console.warn(prefix + consoleMessageEvent.message);
                    break;

                case 2:
                    console.error(prefix + consoleMessageEvent.message);
                    break;

            }

        });

    }

    private onLoadURL(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Loading URL: " + value);

        this.loadedURL = true;
        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.PROVIDE_URL, value);

    }

    private onTriggerCapture() {

        this.createProgressBar();
        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.TRIGGER_CAPTURE, {});

    }

    private onBrowserChanged(browserName: string) {

        const browser = BrowserRegistry[browserName];

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.CONFIGURE_WINDOW, browser);

    }

    private onReload() {

        const content = this.getContentHost();

        this.onLoadURL(content.getURL());

    }

    /**
     * Should be called every time we change the high level URL being viewed.
     *
     * @param url
     */
    private onWebviewNavigated(url: string, eventName: string) {

        log.debug("within onWebviewNavigated");

        if (! isPresent(url) || isSplashPage(url)) {
            log.debug(`SKIPPING onWebviewNavigated: (${eventName}: ${url}`);
            return;
        }

        log.debug(`HANDLING onWebviewNavigated: (${eventName}: ${url}`);

        this.changeURL(url);
        this.createProgressBar();
        this.scrollPageToTop();
        this.startResizingWebview();

    }

    private scrollPageToTop() {
        // scroll to the top of the page...
        document.body.scrollTo(0, 0);
    }

    private createProgressBar() {
        // create a progress bar so we know that the page is loading

        if (! this.progressBar) {
            this.progressBar = ProgressBar.create(true);
        }

    }

    private changeURL(url: string) {
        const element = document.querySelector("#url-bar")! as HTMLInputElement;
        element.value = url;
    }

    private startResizingWebview() {

        const contentHost = this.getContentHost();
        const backgroundFrameResizer
            = new BackgroundFrameResizer(contentHost.parentElement!, contentHost);

        backgroundFrameResizer.start();

    }

    private refreshTitle(eventName: string) {
        const contentHost = this.getContentHost();
        document.title = contentHost.getTitle();
    }

    private getContentHost() {
        return document.querySelector("#content")! as Electron.WebviewTag;
    }

}

function isSplashPage(url: string) {
    return url.endsWith('/apps/browser/splash.html');
}

export interface NavigationEvent {

    /**
     * The URL at the time of navigation.
     */
    readonly url: string;

    /**
     * The type of navigation (start or stop loading).
     */
    readonly type: NavigationEventType;

}

export type NavigationEventType = 'did-start-loading' | 'did-stop-loading';

export namespace TriggerBrowserLoad {

    export const MESSAGE_TYPE = 'trigger-browser-load-url';

    export interface Message {
        type: string;
        url: string;
    }

}
