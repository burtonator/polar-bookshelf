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
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";
import {
    IDocDescriptor,
    IDocScale,
    useDocViewerCallbacks
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
    usePrefsContext
} from "../../../../repository/js/persistence_layer/PersistenceLayerApp";
import {ExtendPagemark} from "polar-pagemarks-auto/src/AutoPagemarker";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {useAnnotationBar} from "../../AnnotationBarHooks";
import {DocumentInit} from "../DocumentInitHook";
import {useDocViewerPageJumpListener} from '../../DocViewerAnnotationHook';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";

interface DocViewer {
    readonly eventBus: EventBus;
    readonly findController: PDFFindController;
    readonly viewer: PDFViewer;
    readonly linkService: PDFLinkService;
    readonly renderingQueue: PDFRenderingQueue;
    readonly containerElement: HTMLElement;
}

function createDocViewer(): DocViewer {

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

    const containerElement = document.getElementById('viewerContainer')! as HTMLDivElement;

    if (containerElement === null) {
        throw new Error("No containerElement");
    }

    const viewerElement = document.getElementById('viewer')! as HTMLDivElement;

    if (viewerElement === null) {
        throw new Error("No viewerElement");
    }

    const viewerOpts: PDFViewerOptions = {
        container: containerElement,
        viewer: viewerElement,
        textLayerMode: 2,
        linkService, 
        findController,
        eventBus,
        useOnlyCssZoom: false,
        enableWebGL: false,
        renderInteractiveForms: false,
        pdfBugEnabled: false,
        disableRange: false,
        disableStream: false,
        disableAutoFetch: false,
        disableFontFace: false,
        // renderer: "svg",
        // renderingQueue, // this isn't actually needed when its in a scroll container
        maxCanvasPixels: 16777216,
        enablePrintAutoRotate: false,
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

export const PDFDocument = deepMemo((props: IProps) => {

    const {docURL} = props;
    const [active, setActive] = React.useState(false);

    const docViewerRef = React.useRef<DocViewer | undefined>(undefined);
    const scaleRef = React.useRef<ScaleLevelTuple>(ScaleLevelTuples[1]);
    const docRef = React.useRef<PDFDocumentProxy | undefined>(undefined);
    const pageNavigatorRef = React.useRef<PageNavigator | undefined>(undefined);

    const log = useLogger();

    const {setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler, setDocScale, setPage}
        = useDocViewerCallbacks();

    const {setFinder} = useDocFindCallbacks();
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const prefs = usePrefsContext();
    const annotationBarInjector = useAnnotationBar();
    useDocViewerPageJumpListener();

    useComponentDidMount(() => {

        docViewerRef.current = createDocViewer();

        doLoad(docViewerRef.current)
            .catch(err => console.error("PDFDocument: Could not load PDF: ", err));

    });

    const doLoad = async (docViewer: DocViewer) => {

        const loadingTask = PDFDocs.getDocument({url: docURL, docBaseURL: docURL});

        let progressTracker: ProgressTracker | undefined;
        loadingTask.onProgress = (progress) => {

            if (! progressTracker) {
                progressTracker = new ProgressTracker({
                    id: 'pdf-download',
                    total: progress.total
                });
            }

            if (progress.loaded > progress.total) {
                return;
            }

            ProgressMessages.broadcast(progressTracker!.abs(progress.loaded));

        };

        docRef.current = await loadingTask.promise;

        const page = await docRef.current.getPage(1);
        const viewport = page.getViewport({scale: 1.0});

        const calculateScale = (to: number, from: number) => {
            console.log(`Calculating scale from ${from} to ${to}...`);
            return to / from;
        };

        docViewer.viewer.setDocument(docRef.current);
        docViewer.linkService.setDocument(docRef.current, null);

        const finder = PDFFindControllers.createFinder(docViewer.eventBus,
                                                       docViewer.findController);
        setFinder(finder);

        docViewer.eventBus.on('pagesinit', () => {

            // PageContextMenus.start()
            annotationBarInjector();

            if (! active) {
                setActive(true);
            }

        });

        const resizeDebouncer = Debouncers.create(() => resize());

        window.addEventListener('resize', resizeDebouncer);

        document.getElementById("viewerContainer")!
            .addEventListener("resize", resizeDebouncer);

        setResizer(resizeDebouncer);

        // do first resize async
        setTimeout(() => resize(), 1 );

        function createPageNavigator(pdfDocumentProxy: _pdfjs.PDFDocumentProxy): PageNavigator {

            const count = pdfDocumentProxy.numPages;

            function get(): number {
                return docViewer.viewer.currentPageNumber;
            }

            async function jumpToPage(page: number) {
                docViewer.viewer.currentPageNumber = page;
            }

            return {count, jumpToPage, get};

        }

        pageNavigatorRef.current = createPageNavigator(docRef.current);

        dispatchPDFDocMeta();

        setPageNavigator(pageNavigatorRef.current);

        const handleScroll = Debouncers.create(() => {
            dispatchPDFDocMeta();
        });

        docViewer.containerElement.addEventListener('scroll', () => {
            handleScroll();
        });

        const scaleLeveler = (scale: ScaleLevelTuple) => {
            return setScale(scale);
        };

        setScaleLeveler(scaleLeveler);

        class PDFDocScale implements IDocScale {

            get scale(): ScaleLevelTuple {
                const currentScaleValue = docViewerRef.current!.viewer.currentScaleValue;
                const result = ScaleLevelTuplesMap[currentScaleValue];

                if (! result) {
                    return ScaleLevelTuplesMap["page width"];
                }

                return result;

            }

            get scaleValue(): number {
                return docViewerRef.current!.viewer.currentScale;
            }

        }

        setDocScale(new PDFDocScale());

        function enableAutoPagemarks() {

            if (prefs.get(KnownPrefs.AUTO_PAGEMARKS) !== 'true') {
                // only enable this via prefs now...
                return;
            }

            console.log("Auto pagemarks enabled");

            const {docMeta} = props;

            async function doWriteDocMeta() {
                const persistenceLayer = persistenceLayerProvider();
                await persistenceLayer.writeDocMeta(docMeta);
            }

            const extender = Pagemarks.createExtender(docMeta);

            function onPagemarkExtend(extendPagemark: ExtendPagemark) {

                // perform the mutation of the docMeta now...
                extender(extendPagemark);

                // then persist it back out..

                doWriteDocMeta()
                    .catch(err => log.error("Unable to write docMeta: ", err));

            }

            // start the auto-pagemark system.
            Scrollers.register(onPagemarkExtend, {mode: 'full'});

        }

        enableAutoPagemarks();

    }

    function resize(): number {

        if (['page-width', 'page-fit'].includes(scaleRef.current.value)) {
            setScale(scaleRef.current);
        }

        if (docViewerRef.current) {
            return docViewerRef.current.viewer.currentScale;
        } else {
            throw new Error("No viewer");
        }


    }

    function setScale(scale: ScaleLevelTuple) {

        if (docViewerRef.current) {
            scaleRef.current = scale;
            docViewerRef.current.viewer.currentScaleValue = scale.value;

            dispatchPDFDocMeta();

            return docViewerRef.current.viewer.currentScale;

        }

        throw new Error("No viewer");

    }

    function dispatchPDFDocMeta() {

        if (docRef.current && docViewerRef.current) {

            const docDescriptor: IDocDescriptor = {
                // title: docRef.current.title,
                // scale: scaleRef.current,
                // scaleValue: docViewerRef.current.viewer.currentScale,
                nrPages: docRef.current.numPages,
                fingerprint: docRef.current.fingerprint
            };

            setPage(pageNavigatorRef.current!.get());
            setDocDescriptor(docDescriptor);

        }

    }

    return active && (
        <>
            <DocumentInit/>
            {props.children}
        </>
    ) || null;

});

