import {Screenshot} from '../../../screenshots/Screenshot';
import {Optional} from 'polar-shared/src/util/ts/Optional';

/**
 * Remove the selection, take a screenshot, then restore it.
 */
export class SelectionScreenshots {

    // public static capture(doc: Document, win: Window) {
    //
    //     return this.withoutRange(doc, win, range => {
    //
    //         return this.captureRange(win, range);
    //
    //     });
    //
    // }
    //
    // public static captureRange(win: Window, range: Range): SelectionScreenshot {
    //     let clientRect = this.getClientRect(range);
    //     clientRect = IFrames.computeTopLevelClientRect(clientRect, win);
    //
    //     const capturedScreenshotPromise = CapturedScreenshots.capture(clientRect);
    //
    //     return {clientRect, capturedScreenshotPromise};
    // }

    public static getClientRect(range: Range) {
        return range.getBoundingClientRect();
    }

    public static withoutRange<T>(doc: Document, win: Window, handler: (range: Range) => T): T {

        const sel = win.getSelection();
        const range = sel!.getRangeAt(0);

        doc.body.classList.toggle('selection-disabled', true);

        const result = handler(range);

        doc.body.classList.toggle('selection-disabled', false);

        return result;

    }

}

export interface SelectionScreenshot {

    /**
     * The clientRect with iframes factored in, used to take this screenshot.
     */
    readonly clientRect: ClientRect;

    readonly capturedScreenshotPromise: Promise<Optional<Screenshot>>;

}
