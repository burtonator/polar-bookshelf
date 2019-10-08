import {ipcRenderer} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Elements} from '../../util/Elements';
import {notNull} from 'polar-shared/src/Preconditions';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class ProgressUI {

    constructor() {

    }

    init() {

        // listen and handle "capture-progress" IPC messages

        log.info("Listening for progress updates...");

        ipcRenderer.on('capture-progress-update', (event: Electron.Event, progressEvent: PendingWebRequestsEvent) => {
            this.onProgressEvent(progressEvent);
        });


    }

    onProgressEvent(progressEvent: PendingWebRequestsEvent) {

        log.info("Got progress update: ", progressEvent.progress);

        this.updateProgress(progressEvent);
        this.updateLogView(progressEvent);

    }

    updateProgress(progressEvent: PendingWebRequestsEvent) {

        let progressElement = <HTMLProgressElement>document.querySelector("progress");
        progressElement.value = progressEvent.progress;

    }

    updateLogView(progressEvent: PendingWebRequestsEvent) {

        let logElement = notNull(document.querySelector(".log"));

        let lineElement = Elements.createWrapperElementHTML(`<div class="">${progressEvent.details.url}</div>`);

        logElement.appendChild(lineElement);

    }

}

