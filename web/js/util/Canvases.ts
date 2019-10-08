import {ArrayBuffers} from 'polar-shared/src/util/ArrayBuffers';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {ImageType, ExtractedImage} from '../screenshots/Screenshot';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {DataURL} from './DataURLs';

const IMAGE_TYPE = 'image/png';
const IMAGE_QUALITY = 1.0;

/**
 * Functions for working with canvas objects, extracting screenshots, etc.
 */
export class Canvases {

    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/pdf-loader.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/extractor.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/debug-canvas.js

    /**
     * Take a canvas or an ArrayBuffer and convert it to a data URL without
     * limitations on the size of the URL.
     */
    public static async toDataURL(data: HTMLCanvasElement | ArrayBuffer,
                                  opts: ImageOpts = new DefaultImageOpts()): Promise<string> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob

        const toArrayBuffer = async (): Promise<ArrayBuffer> => {

            if (data instanceof HTMLCanvasElement) {
                return await this.toArrayBuffer(data, opts);
            }

            return data;

        };

        const ab = await toArrayBuffer();

        const encoded = ArrayBuffers.toBase64(ab);

        return `data:${IMAGE_TYPE};base64,` + encoded;

    }

    public static toArrayBuffer(canvas: HTMLCanvasElement,
                                opts: ImageOpts = new DefaultImageOpts()): Promise<ArrayBuffer> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob
        //
        return new Promise((resolve, reject) => {

            canvas.toBlob((blob) => {

                if (blob) {

                    const reader = new FileReader();

                    reader.addEventListener("onloadstart", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("loadend", () => {
                        const ab = <ArrayBuffer> reader.result;
                        resolve(ab);
                    });

                    reader.addEventListener("onerror", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("onabort", (err) => {
                        reject(err);
                    });

                    reader.readAsArrayBuffer(blob);

                } else {
                    reject(new Error("No blob"));
                }

            }, opts.type, opts.quality);

        });

    }

    public static async crop(image: DataURL | HTMLImageElement,
                             rect: ILTRect,
                             opts: CropOpts = new DefaultImageOpts()): Promise<DataURL> {

        const createSRC = () => {

            if (image instanceof HTMLImageElement) {
                return image;
            }

            return new Promise<HTMLImageElement>((resolve, reject) => {

                const img = document.createElement("img") as HTMLImageElement;
                img.src = image;

                img.onload = () => resolve(img);

                img.onerror = (err) => reject(err);
                img.onabort = (err) => reject(err);

                return img;

            });

        };

        const src = await createSRC();

        const canvas = opts.canvas || document.createElement("canvas");

        canvas.width  = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d', {alpha: false})!;

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(src,
                      rect.left, rect.top, rect.width, rect.height,
                      0, 0, rect.width, rect.height);

        return canvas.toDataURL();

    }

    /**
     * Extract image data from the given canvas directly and return it as an
     * array buffer.
     * @param canvas The canvas we should extract with.
     * @param rect The rect within the given canvas
     * @param opts The options for the image extraction
     */
    public static async extract(canvas: HTMLCanvasElement,
                                rect: ILTRect,
                                opts: ImageOpts = new DefaultImageOpts()): Promise<ExtractedImage> {

        Preconditions.assertPresent(canvas, "canvas");

        const xScale = canvas.width / canvas.offsetWidth;
        const yScale = canvas.height / canvas.offsetHeight;

        // scale the canvas rect to the actual width + height
        // of the internal canvas.
        const canvasRect = {
            left: rect.left * xScale,
            width: rect.width * xScale,
            top: rect.top * yScale,
            height: rect.height * yScale
        };

        const tmpCanvas = document.createElement("canvas");

        const tmpCanvasCtx = tmpCanvas.getContext('2d', {alpha: false})!;
        tmpCanvasCtx.imageSmoothingEnabled = false;

        tmpCanvas.width  = canvasRect.width;
        tmpCanvas.height = canvasRect.height;

        // copy data from the source canvas to the target
        tmpCanvasCtx.drawImage(canvas,
                               canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height,
                               0, 0, canvasRect.width, canvasRect.height);

        const data = await this.toArrayBuffer(tmpCanvas, opts);

        const result = {
            data,
            width: canvasRect.width,
            height: canvasRect.height,
            type: opts.type
        };

        return result;

    }

}

interface CropOpts extends ImageOpts {
    canvas?: HTMLCanvasElement;
}

interface ImageOpts {
    readonly type: ImageType;
    readonly quality: number;

}

class DefaultImageOpts implements ImageOpts {
    public readonly type = IMAGE_TYPE;
    public readonly quality = IMAGE_QUALITY;
}
