import {notNull, Preconditions} from 'polar-shared/src/Preconditions';
import {Elements} from '../util/Elements';
import {DocDetail} from '../metadata/DocDetail';
import {IDimensions} from "../util/IDimensions";

/**
 * Get the proper docFormat to work with.
 */
export abstract class DocFormat {

    public abstract readonly name: DocFormatName;

    public currentScale(): number {
        return 1.0;
    }

    public getPageNumFromPageElement(pageElement: HTMLElement): number {
        Preconditions.assertNotNull(pageElement, "pageElement");
        const dataPageNum = notNull(pageElement.getAttribute("data-page-number"));
        return parseInt(dataPageNum);
    }

    public getPageElementFromPageNum(pageNum: number): HTMLElement {

        if (!pageNum) {
            throw new Error("Page number not specified");
        }

        const pageElements = document.querySelectorAll(".page");

        // note that elements are 0 based indexes but our pages are 1 based
        // indexes.
        const pageElement = pageElements[pageNum - 1];

        if (! pageElement) {
            throw new Error("Unable to find page element for page num: " + pageNum);
        }

        return <HTMLElement> pageElement;

    }

    /**
     * Get the current page number based on which page is occupying the largest
     * percentage of the viewport.
     */
    public getCurrentPageElement(): HTMLElement | null {

        const pageElements = document.querySelectorAll(".page");

        if (pageElements.length === 1) {

            // if we only have one page, just go with that as there are no other
            // options.  This was added to avoid a bug in calculate visibility
            // but it works.
            return pageElements[0] as HTMLElement;

        }

        const result = <CurrentPageElement> {
            element: null,
            visibility: 0
        };

        pageElements.forEach(pageElement => {

            const element = <HTMLElement> pageElement;

            const visibility = Elements.calculateVisibilityForDiv(element);

            if ( visibility > result.visibility) {
                result.element = element;
                result.visibility = visibility;

            }

        });

        return result.element;

    }

    /**
     * Get all the metadata about the current page.
     */
    public getCurrentPageDetail(): PageDetail {

        const pageElement = notNull(this.getCurrentPageElement());
        const pageNum = this.getPageNumFromPageElement(pageElement);

        return { pageElement, pageNum };

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public abstract currentDocFingerprint(): string | undefined;

    /**
     * Get the current state of the doc.
     */
    public abstract currentState(): CurrentDocState;

    public supportThumbnails() {
        return false;
    }

    public textHighlightOptions() {
        return {};
    }

    public targetDocument(): HTMLDocument | null {
        throw new Error("Not implemented");
    }

    public docDetail(): DocDetail {

        const fingerprint = this.currentDocFingerprint();

        if (! fingerprint) {
            throw new Error("No document loaded");
        }

        return { fingerprint };

    }

    public async getCanvas(pageNum: number): Promise<HTMLCanvasElement> {

        const pageElement = this.getPageElementFromPageNum(pageNum);

        return <HTMLCanvasElement> pageElement.querySelector("canvas");

    }

}

export interface PageDetail {
    readonly pageElement: HTMLElement;
    readonly pageNum: number;
    readonly dimensions?: IDimensions;
}

export interface CurrentPageElement {
    element: HTMLElement | null;
    visibility: number;
}

export interface CurrentDocState {

    readonly nrPages: number;

    readonly currentPageNumber: number;

}

export type DocFormatName = 'html' | 'pdf';
