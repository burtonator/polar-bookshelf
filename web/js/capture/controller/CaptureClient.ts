import {ipcRenderer} from "electron";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class CaptureClient {


    /**
     * Send a message to the main process to start the capture for us.
     *
     */
    public static startCapture(url: string, webContentsId?: number) {

        const startCaptureMessage: StartCaptureMessage = {
            url,
            webContentsId
        };

        log.info("Sending message to start capture: ", startCaptureMessage);
        ipcRenderer.send('capture-controller-start-capture', startCaptureMessage);

    }

}

export interface StartCaptureMessage {
    readonly url: string;
    readonly webContentsId?: number;
}

