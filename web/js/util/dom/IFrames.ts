import {isPresent} from 'polar-shared/src/Preconditions';
import {URLStr} from "polar-shared/src/util/Strings";

export class IFrames {

    public static async waitForContentDocument(iframe: HTMLIFrameElement,
                                               options: WaitForContentDocumentOptions = { initialURL: 'about:blank'}): Promise<HTMLDocument> {

        return new Promise<HTMLDocument>(resolve => {

            const timer = () => {

                if (iframe.contentDocument) {

                    const currentURL = this.getURL(iframe);

                    if (currentURL !== options.initialURL) {
                        resolve(iframe.contentDocument);
                        return;
                    }

                }

                setTimeout(timer, 100);

            };

            timer();

        });

    }

    /**
     * Mark the frame as loaded manually by specifying a data attribute.
     */
    public static markLoadedManually(iframe: HTMLIFrameElement, url: URLStr) {

        iframe.setAttribute('data-loaded-src', url);

    }

    public static getURL(iframe: HTMLIFrameElement): string | undefined {

        if (! iframe) {
            return undefined;
        }

        const loadedSrc = iframe.getAttribute('data-loaded-src');

        if (loadedSrc) {
            return loadedSrc;
        }

        if (iframe.contentDocument && iframe.contentDocument!.location) {
            return iframe.contentDocument!.location!.href;
        }

        return undefined;

    }

    /**
     * Compute the rect in the given window from the perspective of the top level
     * window.  We use the frameElement and walk backwards.
     *
     * @param clientRect
     * @param win
     */
    public static computeTopLevelClientRect(clientRect: ClientRect, win: Window): ClientRect {

        while (isPresent(win.frameElement)) {

            const iframeClientRect = win.frameElement.getBoundingClientRect();

            const left = clientRect.left + iframeClientRect.left;
            const top = clientRect.top + iframeClientRect.top;
            const width = clientRect.width;
            const height = clientRect.height;
            const bottom = top + height;
            const right = left + width;

            clientRect = { left, top, width, height, bottom, right };

            win = win.parent;

        }

        return clientRect;

    }

}

interface WaitForContentDocumentOptions {
    readonly initialURL: string;
}
