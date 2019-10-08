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
import {RendererAnalytics} from '../../ga/RendererAnalytics';

const log = Logger.create();

export class BrowserApp {

    /**
     * Truen when the user has loaded an external URL.
     */
    private loadedURL: boolean = false;

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

            content.addEventListener('will-navigate', (event: Electron.WillNavigateEvent) => {
                this.onWebviewNavigated(event.url);
            });

            ['did-start-loading', 'did-stop-loading', 'did-fail-load', 'dom-ready' ]
                .map(eventListenerName => content.addEventListener(eventListenerName, () => this.refreshTitle(eventListenerName)));

            ['did-start-loading', 'did-frame-navigate' ]
                .map(eventListenerName => content.addEventListener(eventListenerName, (event) => {

                    // TODO: refactor this so it only works on the top level
                    // navigation changes but we weren't able to do this because
                    // the event we're receiving is generic.

                    const currentURL = content.getURL();

                    this.onWebviewNavigated(currentURL);

                    if (this.loadedURL) {
                        return;
                    }

                    if (currentURL && currentURL !== '' && ! currentURL.startsWith("file:")) {
                        this.loadedURL = true;
                    } else {
                        return;
                    }

                    navigationReactor.dispatchEvent({url: currentURL, type: 'did-start-loading'});

                }));

            // Corresponds to the points in time when the spinner of the tab
            // stops spinning.
            content.addEventListener('did-stop-loading', (event) => {

                if (! this.loadedURL) {
                    return;
                }

                if (this.progressBar) {
                    this.progressBar.destroy();
                }

                const currentURL = content.getURL();

                navigationReactor.dispatchEvent({url: currentURL, type: 'did-stop-loading'});

            });

            content.addEventListener('did-fail-load', (event) => {
                log.warn("Load of URL failed.", event);
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

        RendererAnalytics.event({category: 'content-capture', action: 'loaded-url'});

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.PROVIDE_URL, value);

    }

    private onTriggerCapture() {

        RendererAnalytics.event({category: 'content-capture', action: 'triggered'});

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.TRIGGER_CAPTURE, {});

    }

    private onBrowserChanged(browserName: string) {

        const browser = BrowserRegistry[browserName];

        RendererAnalytics.event({category: 'content-capture', action: 'browser-changed'});

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
    private onWebviewNavigated(url: string) {

        if (! isPresent(url) || url.startsWith("file:")) {
            return;
        }

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
