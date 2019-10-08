import {Logger} from 'polar-shared/src/logger/Logger';
import {FrameEvents} from './FrameEvents';
import {Events} from '../../util/dom/Events';
import {IFrames} from '../../util/dom/IFrames';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';

const log = Logger.create();

/**
 * Moves events from the iframe, into the target element. This allows the event
 * listeners to see the event as if it was called inside the parent .page in the
 * parent DOM window.
 */
export class EventBridge {

    private readonly targetElement: HTMLElement;

    private readonly iframe: HTMLIFrameElement;

    constructor(targetElement: HTMLElement, iframe: HTMLIFrameElement) {
        this.targetElement = targetElement;
        this.iframe = iframe;
    }

    public async start() {

        if (! this.iframe.parentElement) {
            throw new Error("No parent for iframe");
        }

        if (! this.iframe.contentDocument) {
            throw new Error("No contentDocument for iframe");
        }

        await IFrames.waitForContentDocument(this.iframe);
        await DocumentReadyStates.waitFor(this.iframe.contentDocument!, 'interactive');

        this.addListeners(this.iframe);

        log.info("Event bridge started on: ", this.iframe.contentDocument!.location!.href);

    }

    private addListeners(iframe: HTMLIFrameElement) {

        if (! iframe.contentDocument) {
            return;
        }

        iframe.contentDocument.defaultView!.addEventListener("wheel", event => {

            event.preventDefault();

            document.querySelector(".polar-viewer")!
                .scrollBy(event.deltaX, event.deltaY);

            return false;

        }, {passive: false});

        // TODO: intercept up/down/left/right/pgup and pgdn and re-send them to
        // the main window.

        iframe.contentDocument.defaultView!.addEventListener('mouseup', event => this.forwardWindowEvent(event));

        iframe.contentDocument.body.addEventListener("keyup", this.forwardKeyboardEvent.bind(this));
        iframe.contentDocument.body.addEventListener("keydown", this.forwardKeyboardEvent.bind(this));

        iframe.contentDocument.body.addEventListener("mouseup", this.forwardMouseEvent.bind(this));
        iframe.contentDocument.body.addEventListener("mousedown", this.forwardMouseEvent.bind(this));

        iframe.contentDocument.body.addEventListener('contextmenu', (event) => {
            this.forwardMouseEvent(event);
            event.preventDefault();
        });

        iframe.contentDocument.body.addEventListener("click", event => {

            const anchor = Events.getAnchor(event.target);

            // TODO: this needs to be reworked. This isn't the appropriate way
            // to handle this.  I'm going to have to think about which "actions"
            // must be handled by Polar and which ones we allow to be handled
            // by the PHZ.  All Polar actions should call preventDefault and
            // should preventDefault and not sent to the PHZ.

            if (anchor) {
                log.info("Link click prevented.");
                event.preventDefault();

                const href = anchor.href;

                if (href && (href.startsWith("http:") || href.startsWith("https:"))) {
                    // this is a bit of a hack but basically we listen for URLs
                    // in the iframe and change the main page. This triggers our
                    // electron 'will-navigate' which which prevents it and then
                    // opens the URL in the native browser.
                    document.location!.href = href;
                }

            } else {
                this.forwardMouseEvent(event);
            }

        });

    }

    private forwardMouseEvent(event: any) {

        const eventPoints = FrameEvents.calculatePoints(this.iframe, event);

        const newEvent = new event.constructor(event.type, event);

        // TODO: the issue now , I think, is that these values need to be updated
        // vs the current scroll.x and scroll.y

        Object.defineProperty(newEvent, "pageX", {value: eventPoints.page.x});
        Object.defineProperty(newEvent, "pageY", {value: eventPoints.page.y});

        Object.defineProperty(newEvent, "clientX", {value: eventPoints.client.x});
        Object.defineProperty(newEvent, "clientY", {value: eventPoints.client.y});

        Object.defineProperty(newEvent, "offsetX", {value: eventPoints.offset.x});
        Object.defineProperty(newEvent, "offsetY", {value: eventPoints.offset.y});

        if (newEvent.pageX !== eventPoints.page.x) {
            throw new Error("Define of properties failed");
        }

        this.targetElement.dispatchEvent(newEvent);

    }

    private forwardKeyboardEvent(event: any) {

        const newEvent = new event.constructor(event.type, event);
        this.targetElement.dispatchEvent(newEvent);

    }


    private forwardWindowEvent(event: any) {

        const newEvent = new event.constructor(event.type, event);
        window.dispatchEvent(newEvent);

    }

}
