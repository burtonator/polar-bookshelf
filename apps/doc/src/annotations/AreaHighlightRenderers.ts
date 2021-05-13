import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPoint} from "../../../../web/js/Point";
import {IDocScale} from "../DocViewerStore";
import {Screenshots} from "../../../../web/js/screenshots/Screenshots";
import {ICapturedScreenshot} from "../../../../web/js/screenshots/Screenshot";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";
import {FileType} from "../../../../web/js/apps/main/file_loaders/FileType";
import {Preconditions} from "polar-shared/src/Preconditions";
import {IRect} from "polar-shared/src/util/rects/IRect";

export namespace AreaHighlightRenderers {

    import getPageElementDimensions = AnnotationRects.getPageElementDimensions;

    export interface ICapturedAreaHighlight {
        readonly capturedScreenshot: ICapturedScreenshot;
        readonly areaHighlight: IAreaHighlight;
        readonly position: Position;
    }

    export async function createAreaHighlightFromEvent(pageNum: number,
                                                       areaHighlightRect: ILTRect,
                                                       docScale: IDocScale,
                                                       fileType: FileType,
                                                       docViewerElement: HTMLElement): Promise<ICapturedAreaHighlight> {

        Preconditions.assertPresent(fileType, 'fileType');

        const rect = AnnotationRects.createFromPointWithinPageElement(pageNum, areaHighlightRect, docViewerElement);

        const pageDimensions = getPageElementDimensions(pageNum, docViewerElement);

        if (! pageDimensions) {
            throw new Error("No page dimensions");
        }

        const overlayRect = rect.toDimensions(pageDimensions);

        const positionRect = AreaHighlights.toCorrectScale2(overlayRect,
                                                            docScale.scaleValue);

        const position: Position = {
            x: positionRect.left,
            y: positionRect.top,
            width: positionRect.width,
            height: positionRect.height,
        };

        const capturedScreenshot = await Screenshots.capture({pageNum, boxRect: overlayRect, fileType, docViewerElement});

        Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot');

        const areaHighlight = AreaHighlights.create({rect});

        return {capturedScreenshot, areaHighlight, position};

    }

    export async function createAreaHighlightFromOverlayRect(pageNum: number,
                                                             overlayRect: ILTRect,
                                                             docScale: IDocScale,
                                                             fileType: FileType,
                                                             docViewerElement: HTMLElement): Promise<ICapturedAreaHighlight> {
        Preconditions.assertPresent(fileType, 'fileType');

        const rect = AnnotationRects.createFromOverlayRect(pageNum, overlayRect, docViewerElement);

        const pageDimensions = getPageElementDimensions(pageNum, docViewerElement);

        if (! pageDimensions) {
            throw new Error("No page dimensions");
        }

        const positionRect = AreaHighlights.toCorrectScale2(overlayRect,
                                                            docScale.scaleValue);

        const position: Position = {
            x: positionRect.left,
            y: positionRect.top,
            width: positionRect.width,
            height: positionRect.height,
        };

        const capturedScreenshot = await Screenshots.capture({
            pageNum,
            boxRect: overlayRect,
            fileType,
            docViewerElement
        });

        const areaHighlight = AreaHighlights.create({rect});

        return {capturedScreenshot, areaHighlight, position};

    }


}

