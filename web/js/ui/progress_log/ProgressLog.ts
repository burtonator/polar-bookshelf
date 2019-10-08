import {Logger} from 'polar-shared/src/logger/Logger';
import {Elements} from '../../util/Elements';
import {notNull} from 'polar-shared/src/Preconditions';
import {ProgressEvent} from './ProgressEvent';
import {Strings} from "polar-shared/src/util/Strings";

const log = Logger.create();

/**
 * A ProgressLog keeps allows us to update a log line display and a progress
 * bar while a process is moving forward.  Used via sync, capture, and other
 * future services.
 */
export class ProgressLog {

    constructor() {

    }

    /**
     * Called when we should update the progress of our app as it moves forward
     * and completes work.
     */
    update(progressEvent: ProgressEvent) {

        log.info("Got progress update: ", progressEvent.percentage);

        this.updateProgress(progressEvent);
        this.updateLogView(progressEvent);

    }

    private updateProgress(progressEvent: ProgressEvent) {

        let progressElement = <HTMLProgressElement>document.querySelector("progress");
        progressElement.value = progressEvent.percentage;

    }

    private updateLogView(progressEvent: ProgressEvent) {

        if(Strings.empty(progressEvent.message)) {
            return;
        }

        let logElement = notNull(document.querySelector(".log"));

        let lineElement = Elements.createWrapperElementHTML(`<div class="">${progressEvent.message}</div>`);

        logElement.appendChild(lineElement);

    }

}

