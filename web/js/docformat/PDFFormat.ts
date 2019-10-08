import {CurrentDocState, DocFormat} from './DocFormat';
import {Optional} from 'polar-shared/src/util/ts/Optional';

declare var window: any;

export class PDFFormat extends DocFormat {

    public readonly name = 'pdf';

    constructor() {
        super();
    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public currentDocFingerprint(): string | undefined {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument._pdfInfo &&
            window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint != null) {

            return Optional.of(window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint).getOrUndefined();

        }

        return undefined;

    }

    /**
     * Get the current state of the doc.
     */
    public currentState(): CurrentDocState {

        return {
            nrPages: window.PDFViewerApplication.pagesCount,
            currentPageNumber: window.PDFViewerApplication.pdfViewer.currentPageNumber,
        };

    }

    public supportThumbnails() {
        return true;
    }

    public targetDocument(): HTMLDocument | null {
        return document;
    }

    public currentScale() {
        return window.PDFViewerApplication.pdfViewer._currentScale;
    }

}


