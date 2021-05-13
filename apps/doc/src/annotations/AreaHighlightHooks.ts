import * as React from 'react';
import {
    IAreaHighlightCreate,
    IAreaHighlightUpdate,
    useAnnotationMutationsContext
} from "../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IPoint} from "../../../../web/js/Point";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {useDocViewerStore} from "../DocViewerStore";
import {AreaHighlightRenderers} from "./AreaHighlightRenderers";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import createAreaHighlightFromEvent = AreaHighlightRenderers.createAreaHighlightFromEvent;
import createAreaHighlightFromOverlayRect = AreaHighlightRenderers.createAreaHighlightFromOverlayRect;
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";

export interface AreaHighlightCreatedOpts {
    readonly rectWithinPageElement: ILTRect;
    readonly pageNum: number;
}

export interface AreaHighlightUpdatedOpts {
    readonly areaHighlight: IAreaHighlight;
    readonly overlayRect: ILTRect;
    readonly pageNum: number;
}

interface IAreaHighlightHooks {

    readonly onAreaHighlightCreated: (opts: AreaHighlightCreatedOpts) => void;

    readonly onAreaHighlightUpdated: (opts: AreaHighlightUpdatedOpts) => void;

}

export function useAreaHighlightHooks(): IAreaHighlightHooks {

    const {onAreaHighlight} = useAnnotationMutationsContext();
    const {docScale, docMeta} = useDocViewerStore(['docScale', 'docMeta']);
    const {fileType} = useDocViewerContext();
    const log = useLogger();
    const docViewerElementsContext = useDocViewerElementsContext();

    const onAreaHighlightCreatedAsync = React.useCallback(async (opts: AreaHighlightCreatedOpts) => {

        const {pageNum, rectWithinPageElement} = opts;

        if (docScale && docMeta) {

            const docViewerElement = docViewerElementsContext.getDocViewerElement();

            const capturedAreaHighlight =
                await createAreaHighlightFromEvent(pageNum,
                                                   rectWithinPageElement,
                                                   docScale,
                                                   fileType,
                                                   docViewerElement);

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            const mutation: IAreaHighlightCreate = {
                type: 'create',
                docMeta,
                pageMeta,
                ...capturedAreaHighlight
            };

            onAreaHighlight(mutation);

        }

    }, [docMeta, docScale, docViewerElementsContext, fileType, onAreaHighlight]);

    const onAreaHighlightCreated = React.useCallback((opts: AreaHighlightCreatedOpts) => {

        onAreaHighlightCreatedAsync(opts)
            .catch(err => log.error(err));

    }, [log, onAreaHighlightCreatedAsync]);

    const onAreaHighlightUpdatedAsync = React.useCallback(async (opts: AreaHighlightUpdatedOpts) => {

        const {areaHighlight, pageNum, overlayRect} = opts;

        if (docScale && docMeta) {

            const docViewerElement = docViewerElementsContext.getDocViewerElement();

            const capturedAreaHighlight =
                await createAreaHighlightFromOverlayRect(pageNum,
                                                         overlayRect,
                                                         docScale,
                                                         fileType,
                                                         docViewerElement);

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            const mutation: IAreaHighlightUpdate = {
                type: 'update',
                docMeta,
                pageMeta,
                ...capturedAreaHighlight,
                areaHighlight,
            };

            onAreaHighlight(mutation);

        }

    }, [docMeta, docScale, docViewerElementsContext, fileType, onAreaHighlight]);

    const onAreaHighlightUpdated = React.useCallback((opts: AreaHighlightUpdatedOpts) => {

        onAreaHighlightUpdatedAsync(opts)
            .catch(err => log.error(err));

    }, [log, onAreaHighlightUpdatedAsync]);

    return {onAreaHighlightCreated, onAreaHighlightUpdated};

}

