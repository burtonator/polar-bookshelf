import {Logger} from 'polar-shared/src/logger/Logger';
import {CaptureClient} from './CaptureClient';

/**
 * @renderer
 */
export class StartCaptureUI {

    constructor() {
        console.log("Ready to start capture...xxx");

    }

    public init() {

        // wire up the event listeners...

        const form = <HTMLFormElement> document.getElementById("url-form");
        form.onsubmit = () => this.onSubmit();

    }

    public onSubmit() {

        try {

            const urlElement = <HTMLInputElement> document.getElementById("url")!;
            const url = urlElement.value;

            CaptureClient.startCapture(url);

        } catch (e) {
            console.error(e);
        }

        return false;

    }

}
