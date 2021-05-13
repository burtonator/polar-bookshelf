import {
    AnnotationBarCallbacks,
    ControlledAnnotationBar
} from './ControlledAnnotationBar';
import * as React from 'react';
import {
    ActiveSelectionEvent,
    ActiveSelections
} from '../popup/ActiveSelections';
import {ControlledPopupProps} from '../popup/ControlledPopup';
import * as ReactDOM from 'react-dom';
import {Point} from '../../Point';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Points} from '../../Points';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {Elements} from "../../util/Elements";
import {isPresent} from 'polar-shared/src/Preconditions';
import {FileType} from "../../apps/main/file_loaders/FileType";

export interface RegisterOpts {
    readonly fileType: FileType;
    readonly docViewerElementProvider: () => HTMLElement;
}

export namespace ControlledAnnotationBars {

    export function create(controlledPopupProps: ControlledPopupProps,
                           annotationBarCallbacks: AnnotationBarCallbacks,
                           opts: RegisterOpts) {

        registerEventListener(annotationBarCallbacks, opts);

    }

    function registerEventListener(annotationBarCallbacks: AnnotationBarCallbacks,
                                   opts: RegisterOpts) {

        const handleTarget = (target: HTMLElement) => {

            let annotationBar: HTMLElement | undefined;

            interface AnnotationPageInfo {
                readonly pageNum: number;
                /**
                 * The container to hold the annotation bar.
                 */
                readonly popupContainer: HTMLElement;
            }

            ActiveSelections.addEventListener(activeSelectionEvent => {

                const computeAnnotationPageInfo = (): AnnotationPageInfo | undefined => {

                    function getPageNumberForPageElement(pageElement: HTMLElement) {
                        return parseInt(pageElement.getAttribute("data-page-number")!, 10);
                    }

                    const computeForPDF = (): AnnotationPageInfo | undefined => {

                        const pageElement = Elements.untilRoot(activeSelectionEvent.element, ".page");

                        if (! pageElement) {
                            // log.warn("Not found within .page element");
                            return undefined;
                        }

                        const pageNum = getPageNumberForPageElement(pageElement);

                        return {popupContainer: pageElement, pageNum};

                    };

                    const computeForEPUB = (): AnnotationPageInfo | undefined => {

                        const {docViewerElementProvider} = opts;

                        const docViewerElement = docViewerElementProvider();

                        const pageElement = docViewerElement.querySelector('.page') as HTMLElement;
                        const pageNum = getPageNumberForPageElement(pageElement);
                        return {popupContainer: target, pageNum};

                    };

                    switch (opts.fileType) {
                        case "pdf":
                            return computeForPDF();

                        case "epub":
                            return computeForEPUB();
                    }

                };

                const annotationPageInfo = computeAnnotationPageInfo();

                if (! annotationPageInfo) {
                    return;
                }

                switch (activeSelectionEvent.type) {

                    case 'created':

                        annotationBar = createAnnotationBar(annotationPageInfo.pageNum,
                                                            annotationPageInfo.popupContainer,
                                                            annotationBarCallbacks,
                                                            activeSelectionEvent);

                        break;

                    case 'destroyed':

                        if (annotationBar) {
                            destroyAnnotationBar(annotationBar);
                        }

                        break;

                }

                if (activeSelectionEvent.type === 'destroyed') {
                    // only created supported for now.
                    return;
                }

            }, target);
        };

        const targets = computeTargets(opts.fileType, opts.docViewerElementProvider);

        for (const target of targets) {
            handleTarget(target);
        }

    }

    export function computeTargets(fileType: FileType, docViewerElementProvider: () => HTMLElement): ReadonlyArray<HTMLElement> {

        const docViewerElement = docViewerElementProvider();

        function computeTargetsForPDF(): ReadonlyArray<HTMLElement> {
            return Array.from(docViewerElement.querySelectorAll(".page")) as HTMLElement[];
        }

        function computeTargetsForEPUB(): ReadonlyArray<HTMLElement> {
            return Array.from(docViewerElement.querySelectorAll("iframe"))
                        .map(iframe => iframe.contentDocument)
                        .filter(contentDocument => isPresent(contentDocument))
                        .map(contentDocument => contentDocument!)
                        .map(contentDocument => contentDocument.documentElement)
        }

        switch(fileType) {

            case "pdf":
                return computeTargetsForPDF();

            case "epub":
                return computeTargetsForEPUB();

        }

    }

    function destroyAnnotationBar(annotationBar: HTMLElement) {

        if (annotationBar && annotationBar.parentElement) {
            annotationBar.parentElement!.removeChild(annotationBar);
        }

    }

    function computePosition(pageElement: HTMLElement,
                             point: Point,
                             offset: Point | undefined): Point {

        // const docFormat = DocFormatFactory.getInstance();

        const origin: Point =
            Optional.of(pageElement.getBoundingClientRect())
                .map(rect => {
                    return {'x': rect.left, 'y': rect.top};
                })
                .get();

        // one off for the html viewer... I hope we can unify these one day.
        // if (docFormat.name === 'html') {
        //     origin = {x: 0, y: 0};
        // }

        const relativePoint: Point =
            Points.relativeTo(origin, point);

        offset = offset || {x: 0, y: 0};

        const left = relativePoint.x + offset.x;
        const top = relativePoint.y + offset.y;

        return {
            x: left,
            y: top
        };

    }

    function createAnnotationBar(pageNum: number,
                                 popupContainer: HTMLElement,
                                 annotationBarCallbacks: AnnotationBarCallbacks,
                                 activeSelectionEvent: ActiveSelectionEvent) {

        const point: Point = {
            x: activeSelectionEvent.boundingClientRect.left + (activeSelectionEvent.boundingClientRect.width / 2),
            y: activeSelectionEvent.boundingClientRect.top
        };

        const offset: Point = {
            x: -75,
            y: -50
        };

        // TODO use the mouseDirection on the activeSelectionEvent and place
        // with top/bottom

        // TODO: we have to compute the position above or below based on the
        // direction of the mouse movement.

        const position = computePosition(popupContainer, point, offset);

        const annotationBar = document.createElement('div');
        annotationBar.setAttribute("class", 'polar-annotation-bar');

        annotationBar.addEventListener('mouseup', (event) => event.stopPropagation());
        annotationBar.addEventListener('mousedown', (event) => event.stopPropagation());

        const style = `position: absolute; top: ${position.y}px; left: ${position.x}px; z-index: 10000;`;
        annotationBar.setAttribute('style', style);

        popupContainer.insertBefore(annotationBar, popupContainer.firstChild);

        const onHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
            // TODO: there's a delay here and it might be nice to have a progress
            // bar until it completes.
            annotationBarCallbacks.onHighlighted(highlightCreatedEvent);
            destroyAnnotationBar(annotationBar);

        };

        ReactDOM.render(
            <ControlledAnnotationBar activeSelection={activeSelectionEvent}
                                     onHighlighted={onHighlightedCallback}
                                     type='range'
                                     pageNum={pageNum}/>,

            annotationBar

        );

        return annotationBar;

    }

}



