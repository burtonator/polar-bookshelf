import {Logger} from 'polar-shared/src/logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {ViewerTours} from '../../apps/viewer/ViewerTours';
import {Model} from '../../model/Model';
import {Stopwatches} from '../../util/Stopwatches';
import {AppRuntime} from '../../AppRuntime';
import {WindowEvents} from '../../util/dom/WindowEvents';

declare var window: any;

const log = Logger.create();

export class PDFViewer extends Viewer {

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    public start() {

        log.info("Starting PDFViewer");

        RendererAnalytics.pageview("/pdfviewer");

        const stopwatch = Stopwatches.create();

        this.model.registerListenerForDocumentLoaded(event => {

            ViewerTours.createWhenNecessary(event.fingerprint);

            log.notice("Document load time: " + stopwatch.stop());
            this.sendResizeEvent();

            // this.handleChromeSelectionFix();

        });

        this.disableSidebarKeyboardHandling();

    }

    public docDetail(): DocDetail | undefined {

        return {
            fingerprint: this.currentDocFingerprint(),
            title: window.PDFViewerApplication.pdfDocument._pdfInfo.title,
            nrPages: window.PDFViewerApplication.pagesCount,
            filename: this.getFilename()
        };

    }

    private disableSidebarKeyboardHandling() {

        const sidebarElement = document.querySelector(".polar-sidebar")!;

        sidebarElement.addEventListener("keypress", event => {
            event.stopPropagation();
        });

        sidebarElement.addEventListener("keydown", event => {
            event.stopPropagation();
        });

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    private currentDocFingerprint() {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument._pdfInfo &&
            window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint != null) {

            return window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint;

        }

    }

    private sendResizeEvent() {

        if (AppRuntime.isBrowser()) {
            WindowEvents.sendResizeEvent();
        }

    }

    private handleChromeSelectionFix() {

        // TODO: this doesn't seem to work.  Both FF and Chrome now seem to have
        // similar bugs when selecting text and the selection window just jumps
        // wildly to other parts of the DOM and seemingly gets the start and end
        // ranges mixed up.

        // Also, it SAY the even is cancelled but that doesn't actually seem to
        // be the case.

        // TODO: this code works BUT I still can't cancel the selection
        // in the pdfjs viewer for some reason - I think because it has its
        // own handlers setup to do selection manually.

        document.body.addEventListener('mousemove', (event) => {

            if (event.target instanceof HTMLElement) {

                const hasActiveSelection = (): boolean => {

                    const sel = window.getSelection();

                    if (sel.rangeCount === 1 ) {
                        const range = window.getSelection().getRangeAt(0);
                        return ! range.collapsed;
                    }

                    return false;

                };

                const hasJumped = () => {

                    if (event.target instanceof HTMLElement) {
                        return Array.from(event.target.classList).includes("endOfContent");
                    }

                    return false;

                };

                if (hasJumped()) {

                    if (hasActiveSelection()) {
                        event.preventDefault();

                        // console.log("FIXME: preventing");

                        // event.stopPropagation();
                        // event.stopImmediatePropagation();
                    } else {
                        // console.log("FIXME: no active selection");
                    }

                } else {
                    // console.log("FIXME: allowing on: " + event.target.innerText, event.target );
                }

            } else {
                // console.log("FIXME: not an element");
            }


        });

    }

}
