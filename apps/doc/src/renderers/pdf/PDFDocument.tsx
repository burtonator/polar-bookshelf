import * as React from 'react';
import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFRenderingQueue,
    PDFViewer
} from 'pdfjs-dist/web/pdf_viewer';
import {LinkTarget, PDFDocumentProxy, PDFViewerOptions} from "pdfjs-dist";
import {URLStr} from "polar-shared/src/util/Strings";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Callback1} from "polar-shared/src/util/Functions";
import {Finder} from "../../Finders";
import {PDFFindControllers} from "./PDFFindControllers";
import {ProgressMessages} from "../../../../../web/js/ui/progress_bar/ProgressMessages";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {
    ScaleLevelTuple,
    ScaleLevelTuples,
    ScaleLevelTuplesMap
} from "../../ScaleLevels";
import {
    IDocDescriptor,
    IDocScale,
    useDocViewerCallbacks,
    useDocViewerStore
} from "../../DocViewerStore";
import {useDocFindCallbacks} from "../../DocFindStore";
import {PageNavigator} from "../../PageNavigator";
import {PDFDocs} from "polar-pdf/src/pdf/PDFDocs";

import 'pdfjs-dist/web/pdf_viewer.css';
import './PDFDocument.css';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Pagemarks} from "../../../../../web/js/metadata/Pagemarks";
import {Scrollers} from "polar-pagemarks-auto/src/Scrollers";
import {
    usePersistenceLayerContext,
} from "../../../../repository/js/persistence_layer/PersistenceLayerApp";
import {ExtendPagemark} from "polar-pagemarks-auto/src/AutoPagemarker";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {DocumentInit} from "../DocumentInitHook";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IOutlineItem} from "../../outline/IOutlineItem";
import Outline = _pdfjs.Outline;
import {IOutline} from "../../outline/IOutline";
import {Numbers} from "polar-shared/src/util/Numbers";
import Destination = _pdfjs.Destination;
import {Nonces} from "polar-shared/src/util/Nonces";
import {useStateRef} from "../../../../../web/js/hooks/ReactHooks";
import {usePrefsContext} from "../../../../repository/js/persistence_layer/PrefsContext2";
import { usePDFUpgrader } from './PDFUpgrader';
import {ViewerElements} from "../ViewerElements";
import {useDocumentViewerVisibleElemFocus} from '../UseSidenavDocumentChangeCallbackHook';
import {AnnotationPopup, useAnnotationPopupBarEnabled} from '../../annotations/annotation_popup/AnnotationPopup';
import {AreaHighlightCreator} from '../../annotations/AreaHighlightDrawer';
import {useAnnotationBar} from '../../AnnotationBarHooks';
import WebViewer, {Annotations, WebViewerInstance} from '@pdftron/webviewer';
import {PageAnnotations} from '../../annotations/PageAnnotations';
import {TextHighlightMerger} from '../../text_highlighter/TextHighlightMerger';
import {Rects} from '../../../../../web/js/Rects';
import {useAnnotationMutationsContext} from '../../../../../web/js/annotation_sidebar/AnnotationMutationsContext';
import {TextHighlightRecords} from '../../../../../web/js/metadata/TextHighlightRecords';

interface DocViewer {
    readonly eventBus: EventBus;
    readonly findController: PDFFindController;
    readonly viewer: PDFViewer;
    readonly linkService: PDFLinkService;
    readonly renderingQueue: PDFRenderingQueue;
    readonly containerElement: HTMLElement;
}

function createDocViewer(docID: string): DocViewer {

    const eventBus = new EventBus({dispatchToDOM: false});
    // TODO  this isn't actually exported..
    const renderingQueue = new PDFRenderingQueue();

    const linkService = new PDFLinkService({
        eventBus,
        externalLinkTarget: LinkTarget.BLANK
    });

    const findController = new PDFFindController({
        linkService,
        eventBus
    });

    const {containerElement, viewerElement} = ViewerElements.find(docID);

    const viewerOpts: PDFViewerOptions = {
        container: containerElement,
        viewer: viewerElement,
        textLayerMode: 2,
        linkService,
        findController,
        eventBus,
        // useOnlyCssZoom: false,
        // enableWebGL: false,
        // renderInteractiveForms: false,
        // pdfBugEnabled: false,
        // disableRange: false,
        // disableStream: false,
        // disableAutoFetch: false,
        // disableFontFace: false,
        // // renderer: "svg",
        // // renderingQueue, // this isn't actually needed when its in a scroll container
        // maxCanvasPixels: 16777216,
        // enablePrintAutoRotate: false,
        // renderer: RendererType.SVG,
        // renderer: RenderType
        // removePageBorders: true,
        // defaultViewport: viewport
    };

    const viewer = new PDFViewer(viewerOpts);

    linkService.setViewer(viewer);
    renderingQueue.setViewer(viewer);

    (renderingQueue as any).onIdle = () => {
        viewer.cleanup();
    };

    return {eventBus, findController, viewer, linkService, renderingQueue, containerElement};

}

export type OnFinderCallback = Callback1<Finder>;

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

const renderAnnotations = (docMeta: IDocMeta, instance: WebViewerInstance) => {
    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.textHighlights || {}));
    const {docViewer, Annotations} = instance;
    const annotManager = docViewer.getAnnotationManager();
    pageAnnotations.forEach(({ pageNum, annotation, fingerprint }) => {
        const rects = Object.values(annotation.rects);
        if (!rects.length) return;
        const rect = rects.reduce(TextHighlightMerger.mergeRects);
        const annot = new Annotations.TextHighlightAnnotation();
        annot.Id = annotation.guid;
        annot.X = rect.top;
        annot.Y = rect.left;
        annot.Width = rect.width;
        annot.Height = rect.height;
        annot.PageNumber = pageNum;
        annot.StrokeColor = new Annotations.Color(255, 255, 0);
        const quads = rects.map(rect => Rects.scale(rect, 0.75))
            .map(({left, top, width, height}) => new instance.CoreControls.Math.Quad(
                left, top,
                left + width, top,
                left + width, top + height,
                left, top + height
            ));
        annot.Quads = quads;
        annotManager.addAnnotation(annot, {imported: true});
        annotManager.drawAnnotations(annot.PageNumber);
    });
};

export const PDFDocument = deepMemo(function PDFDocument(props: IProps) {
    const annotationMutations = useAnnotationMutationsContext();
    React.useEffect(() => {
        const {docMeta} = props;
        const {containerElement} = ViewerElements.find(props.docMeta.docInfo.fingerprint);
        if (!docMeta || !containerElement) return;
        WebViewer(
          {
            path: '/webviewer/lib',
            initialDoc: props.docURL,
          },
          containerElement,
        ).then((instance) => {
            const { docViewer, annotManager } = instance;

            docViewer.on('documentLoaded', () => {
                renderAnnotations(docMeta, instance);
            });
            annotManager.on("annotationChanged", (annots, action, info) => {
                if (action === "add" && !info.imported) {
                    annots.forEach(annot => {
                        if (annot.Subject === "Highlight") {
                            const highlight = (annot as Annotations.TextHighlightAnnotation);
                            const quads = highlight.Quads;
                            const textHighlight = TextHighlightRecords.create(
                                quads.map(({x1, y1, x2, y2, x3, y3, x4, y4}) => {
                                    const left = Math.min(x1, x2, x3, x4) / 0.75;
                                    const right = Math.max(x1, x2, x3, x4) / 0.75;
                                    const top = Math.min(y1, y2, y3, y4) / 0.75;
                                    const bottom = Math.max(y1, y2, y3, y4) / 0.75;
                                    return {
                                        left,
                                        top,
                                        bottom,
                                        right,
                                        width: right - left,
                                        height: bottom - top,
                                    };
                                }),
                                [],
                                {TEXT: annot.getContents()},
                                "#FF0000"
                            );
                            annotationMutations.onTextHighlight({
                                type: "create",
                                docMeta,
                                pageMeta: docMeta.pageMetas[annot.PageNumber],
                                textHighlight: textHighlight.value
                            });
                        }
                    });
                }
            });
        });
    }, []);

    return null;
});

