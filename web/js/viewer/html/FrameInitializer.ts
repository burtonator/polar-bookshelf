import {notNull} from 'polar-shared/src/Preconditions';
import {EventBridge} from './EventBridge';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

/**
 * Listens for the iframe to load and then sends the events to target objects
 * so that that the page started , and then finished loading.  We then
 * dispatched two callbacks onIFrameLoading and onIFrameLoaded.
 */
export class FrameInitializer {

    private readonly iframe: HTMLIFrameElement;
    private readonly textLayer: HTMLElement;

    private loaded: boolean = false;

    constructor(iframe: HTMLIFrameElement, textLayer: HTMLElement) {

        if (!iframe) {
            throw new Error("No iframe");
        }

        this.iframe = iframe;
        this.textLayer = textLayer;

    }

    public start() {

        notNull(this.iframe.contentDocument)
            .addEventListener("readystatechange", this.onReadyStateChange.bind(this));

        this.checkLoaded();

    }

    private checkLoaded() {

        if (!this.loaded) {
            this.loaded = true;
            this.onLoad();
            log.info("FrameInitializer: Document has finished loading");
        }

    }

    public onReadyStateChange() {

        if (notNull(this.iframe.contentDocument).readyState === "complete") {
            this.checkLoaded();
        }

    }

    /**
     *
     */
    private onLoad() {

        log.info("Frame loaded.  Sending pagesinit on .page");
        this.startEventBridge();
        this.updateDocTitle();
        this.dispatchPagesInit();

    }

    private updateDocTitle() {
        const title = notNull(this.iframe.contentDocument).title;
        log.info("Setting title: " + title);
        document.title = title;
    }

    private dispatchPagesInit() {

        const event = new Event('pagesinit', {bubbles: true});

        // Dispatch the event.
        notNull(document.querySelector(".page")).dispatchEvent(event);

    }

    private startEventBridge() {

        document.querySelectorAll(".page").forEach(pageElement => {
            const eventBridge = new EventBridge(<HTMLElement> pageElement, this.iframe);
            eventBridge.start()
                .catch(err => log.error("Could not run eventBridge: ", err));
        });
    }

}
