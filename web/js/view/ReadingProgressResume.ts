import {Elements} from '../util/Elements';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocMeta} from '../metadata/DocMeta';
import {Pagemark} from '../metadata/Pagemark';
import {Rects} from '../Rects';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

export class ReadingProgressResume {

    public static resume(docMeta: IDocMeta) {
        setTimeout(() => this.doResume(docMeta), 1);
    }

    private static doResume(docMeta: IDocMeta) {

        const targetPagemark = this.computeTargetPagemark(docMeta);

        if (! targetPagemark) {
            return false;
        }

        const pages = document.querySelectorAll(".page");

        const pageNum = targetPagemark.pageNum;

        const pageElement = <HTMLElement> pages[pageNum - 1];

        const scrollParent = this.getScrollParent(pageElement);

        const pageOffset = Elements.getRelativeOffsetRect(pageElement, scrollParent);

        const pageTop = pageOffset.top;
        const pageHeight = Math.floor(pageElement.clientHeight);

        const computePagemarkHeight = (): number => {

            const docFormat = DocFormatFactory.getInstance();

            if (docFormat.name === 'pdf') {

                const pagemarkBottom
                    = Math.floor(Rects.createFromBasicRect(targetPagemark.pagemark.rect).bottom);

                const pagemarkBottomPerc = pagemarkBottom / 100;

                return pageHeight * pagemarkBottomPerc;

            } else {

                const pagemarkElements
                    = Array.from(pageElement.querySelectorAll(".pagemark"));

                // TODO: should be by time and not by position.
                const pagemarkElement =
                    pagemarkElements.sort((a, b) => a.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom)
                        .reduce(Reducers.LAST);

                if (pagemarkElement) {

                    // in HTML mode or PDFs with smaller

                    return pagemarkElement.clientHeight;

                } else {
                    throw new Error("No pagemarkElement");
                }

            }

        };

        // now compute the height of the pagemark so that we scroll to that
        // point.
        const pagemarkHeight = computePagemarkHeight();

        // but adjust it a bit so that the bottom portion of the pagemark is
        // visible by computing the height of the window and shifting it
        const windowDelta = window.innerHeight * (0.2);

        const newScrollTop = Math.floor(pageTop + pagemarkHeight - windowDelta);

        scrollParent.scrollTop = newScrollTop;

        return true;

    }

    private static pdfjsVersion() {

        const win = (<any> window);

        if (win && win.pdfjsLib) {
            return (win.pdfjsLib.version);
        }

        return undefined;

    }

    private static getScrollParent(element: HTMLElement) {

        const docFormat = DocFormatFactory.getInstance();

        if (docFormat.name === 'pdf') {
            return <HTMLElement> document.querySelector("#viewerContainer");
        }

        if (docFormat.name === 'html') {
            return <HTMLElement> document.querySelector(".polar-viewer");
        }

        return  <HTMLElement> Elements.getScrollParent(element);

    }

    private static computePagemarks(docMeta: IDocMeta) {

        const result: PagemarkHolder[] = [];

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const pagemarks = Object.values(pageMeta.pagemarks || {});

            const pagemarkHolders =
                pagemarks.map( pagemark => {
                    return {
                        pageNum: pageMeta.pageInfo.num,
                        pagemark
                    };
                });

            result.push(...pagemarkHolders);

        }

        return result;

    }

    private static computeTargetPagemark(docMeta: IDocMeta): PagemarkHolder | undefined {

        const pagemarkHolders = this.computePagemarks(docMeta);

        let result: PagemarkHolder | undefined;

        /**
         * Compare two pagemarks and return the one that is farthest down the
         * page.
         */
        const comparePagemarks = (p0: PagemarkHolder | undefined, p1: PagemarkHolder) => {

            if (!p0) {
                return p1;
            }

            if (p0.pageNum < p1.pageNum) {
                return p1;
            }

            if (p0.pageNum === p1.pageNum) {

                // TODO: should be by time and not by position.

                if (Rects.createFromBasicRect(p0.pagemark.rect).bottom <
                    Rects.createFromBasicRect(p1.pagemark.rect).bottom) {

                    return p1;

                }

            }

            return p0;

        };

        // TODO: this could be cleaner via a sort + reduce/last
        for (const pagemarkHolder of pagemarkHolders) {
            result = comparePagemarks(result, pagemarkHolder);
        }

        return result;

    }

}

interface TargetPagemark {
    readonly pageNum: number;
}

interface PagemarkHolder {
    readonly pageNum: number;
    readonly pagemark: IPagemark;
}

