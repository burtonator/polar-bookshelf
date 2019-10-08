/**
 * Assumes that you have tried to change the URL for an iframe and watches for
 * it to start loading properly.
 */
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IFrames} from '../../util/dom/IFrames';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';

const log = Logger.create();

export class IFrameWatcher {

    private readonly iframe: HTMLIFrameElement;
    private readonly callback: () => void;

    constructor(iframe: HTMLIFrameElement, callback: () => void) {

        this.iframe = Preconditions.assertNotNull(iframe, "iframe");
        this.callback = Preconditions.assertNotNull(callback, "callback");

    }

    public start() {

        this.execute()
            .catch(err => log.error("Failed watching for iframe: ", err ))

    }

    private async execute(): Promise<void> {

        log.debug("Waiting for iframe to load...");

        log.debug("Waiting for content document...");
        await IFrames.waitForContentDocument(this.iframe);

        log.debug("Waiting for 'complete'");

        await DocumentReadyStates.waitFor(this.iframe.contentDocument!, 'complete');

        log.debug("Waiting for iframe to load...done");

        this.callback();

    }

}
