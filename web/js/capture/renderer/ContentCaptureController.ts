import {ContentCapture} from './ContentCapture';
import {Logger} from 'polar-shared/src/logger/Logger';
import electron, {ipcRenderer} from 'electron';

const log = Logger.create();

/**
 * Controller that intercepts events from the main Electron process, triggers
 * a capture, then returns the results to the caller via a message response.
 */
export class ContentCaptureController {

    /**
     * Start the content capture system which involves listening to IPC messages
     * for triggering rendering.
     */
    start(): void {

        log.info("IPC listener added for content-capture at: " + new Date().toISOString());

        ipcRenderer.on('content-capture', (event: any, data: any) => {

            if(data.type ===  "request") {
                this.onContentCaptureRequest();
            }

        });

        // tell everyone that we've started properly.
        ipcRenderer.send('content-capture', {type: "started"});

    }

    onContentCaptureRequest() {

        log.info("Received content capture request.");

        try {

            const captured = ContentCapture.captureHTML();

            log.info("Content captured successfully.  Sending response...");

            ipcRenderer.send("content-capture", {
                type: "response",
                result: captured
            });

            log.info("Content captured successfully.  Sending response... done");

        } catch (e) {

            log.error("Could not capture HTML: ", e);

            ipcRenderer.send("content-capture", {
                type: "response",
                err: e.message
            });

        }

    }

}
