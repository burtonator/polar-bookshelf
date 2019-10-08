import {DocFormat, DocFormatName, PageDetail} from './DocFormat';
import {notNull} from 'polar-shared/src/Preconditions';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {URLs} from 'polar-shared/src/util/URLs';

export class HTMLFormat extends DocFormat {

    public readonly name = 'html';

    private static canvas: HTMLCanvasElement | undefined;

    constructor() {
        super();
    }

    /**
     * Get all the metadata about the current page.
     */
    public getCurrentPageDetail(): PageDetail {

        const pageElement = notNull(this.getCurrentPageElement());
        const pageNum = this.getPageNumFromPageElement(pageElement);

        const dimensions = {
            width: pageElement.offsetWidth,
            height: pageElement.offsetHeight
        };

        return { pageElement, pageNum, dimensions };

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public currentDocFingerprint(): string | undefined {

        const polarFingerprint = this._queryFingerprintElement();

        if (polarFingerprint !== null) {
            return Optional.of(polarFingerprint.getAttribute("content")!).getOrUndefined();
        }

        return undefined;

    }

    setCurrentDocFingerprint(fingerprint: string) {
        const polarFingerprint = this._queryFingerprintElement();
        polarFingerprint.setAttribute("content", fingerprint);
    }

    private _queryFingerprintElement(): Element {
        return notNull(document.querySelector("meta[name='polar-fingerprint']"));
    }

    /**
     * Get the current state of the doc.
     */
    public currentState() {

        return {
            nrPages: 1,
            currentPageNumber: 1,
        };

    }

    textHighlightOptions() {
        return {
        };
    }

    public currentScale() {

        return Optional.of(document.querySelector("meta[name='polar-scale']"))
            .map(current => current.getAttribute('content'))
            .map(current => parseFloat(current))
            .get();

        /*
        let select = document.querySelector("select");
        let value = select.options[select.selectedIndex].value;

        if(!value) {
            throw new Error("No scale value");
        }

        let result = parseInt(value);

        if(isNaN(result)) {
            throw new Error("Not a number from: " + value);
        }

        if(result <= 0) {
            throw new Error("Scale is too small: " + result);
        }

        return result;
        */

    }

    public targetDocument(): HTMLDocument | null {
        return Optional.of(document.querySelector("iframe")).get().contentDocument;
    }

    public async getCanvas(pageNum: number): Promise<HTMLCanvasElement> {

        throw new Error("Not supported");

    }

}
