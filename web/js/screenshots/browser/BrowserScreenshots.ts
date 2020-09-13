import {WebExtensions} from 'polar-web-extension-api/src/WebExtensions';
import {Result} from 'polar-shared/src/util/Result';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {Results} from 'polar-shared/src/util/Results';
import {Canvases} from 'polar-shared/src/util/Canvases';
import {AnnotationToggler} from '../AnnotationToggler';
import {Screenshots} from "../Screenshots";

export class BrowserScreenshots {

    public static async capture(rect: ILTRect,
                                element?: HTMLElement): Promise<BrowserScreenshot | undefined> {

        rect = Screenshots.computeCaptureRect(rect, element);

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            const captureWithRemoteCrop = async () => {

                const request = {
                    type: 'browser-screenshot',
                    rect
                };

                const response: BrowserScreenshot
                    = await WebExtensions.Messaging.sendMessage(request);

                if (! response) {
                    throw new Error("No response from web extension");
                }

                const result: Result<BrowserScreenshot> = Results.create(response);

                return result.get();

            };

            const captureWithLocalCrop = async () => {

                const annotationToggler = new AnnotationToggler();

                try {

                    await annotationToggler.hide();

                    const request = {
                        type: 'browser-screenshot',
                    };

                    const response: BrowserScreenshot
                        = await WebExtensions.Messaging.sendMessage(request);

                    if (! response) {
                        throw new Error("No response from web extension");
                    }

                    const result: Result<BrowserScreenshot> = Results.create(response);

                    const uncropped = result.get();

                    const croppedImage
                        = await Canvases.crop(uncropped.dataURL, rect);

                    return {
                        type: uncropped.type,
                        dataURL: croppedImage
                    };

                } catch (e) {
                    throw e;
                } finally {
                    annotationToggler.show();
                }

            };

            return await captureWithLocalCrop();

        } else {
            throw new Error("No web extension support");
        }

    }

}

export interface BrowserScreenshot {
    readonly dataURL: string;
    readonly type: 'image/png';
}
