import {webextensions} from '../../../../extension/WebExtensions';
import {Result} from '../../util/Result';
import {BrowserScreenshot} from '../../../../extension/BrowserScreenshotHandler';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {Results} from '../../util/Results';
import {Canvases} from '../../util/Canvases';
import {AnnotationToggler} from '../AnnotationToggler';
import {Toaster} from '../../ui/toaster/Toaster';

export class BrowserScreenshots {

    public static async capture(rect: ILTRect, element: HTMLElement): Promise<BrowserScreenshot | undefined> {

        const {width, height} = rect;

        const boundingClientRect = element.getBoundingClientRect();

        // update the rect to reflect the element not the iframe position.
        rect = {
            left: boundingClientRect.left,
            top: boundingClientRect.top,
            width, height
        };

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            const captureWithRemoteCrop = async () => {

                const request = {
                    type: 'browser-screenshot',
                    rect
                };

                const response: BrowserScreenshot
                    = await webextensions.Messaging.sendMessage(request);

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
                        = await webextensions.Messaging.sendMessage(request);

                    if (!response) {
                        Toaster.error("Area highlights not yet supported in the Polar webapp. ");
                        // Toaster.error("Unable to capture screenshot. Make sure the latest version of the Polar web extension is installed.");
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
