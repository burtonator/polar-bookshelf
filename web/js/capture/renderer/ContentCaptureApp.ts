import {ContentCaptureController} from "./ContentCaptureController";

export class ContentCaptureApp {

    public async start() {

        console.log("Starting content capture app...");

        const contentCaptureController = new ContentCaptureController();
        contentCaptureController.start();

    }

}
