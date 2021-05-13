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
import {useAnnotationBar} from "../../AnnotationBarHooks";
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
import {AreaHighlightCreator} from '../../annotations/AreaHighlightDrawer';

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

export const PDFDocument = deepMemo(function PDFDocument(props: IProps) {

    const {docURL} = props;
    const [active, setActive, activeRef] = useStateRef(false);

    const docViewerRef = React.useRef<DocViewer | undefined>(undefined);
    const scaleRef = React.useRef<ScaleLevelTuple>(ScaleLevelTuples[1]);
    const docRef = React.useRef<PDFDocumentProxy | undefined>(undefined);
    const pageNavigatorRef = React.useRef<PageNavigator | undefined>(undefined);
    const pdfUpgrader = usePDFUpgrader();

    const log = useLogger();

    const {setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler,
           setDocScale, setPage, setOutline, setOutlineNavigator, docMetaProvider, setScale: setStoreScale}
        = useDocViewerCallbacks();

    const {setFinder} = useDocFindCallbacks();
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const prefs = usePrefsContext();
    const annotationBarInjector = useAnnotationBar();

    const hasPagesInitRef = React.useRef(false);
    const hasLoadRef = React.useRef(false);

    const hasLoadStartedRef = React.useRef(false);

    const handleActive = React.useCallback(() => {

        if (hasPagesInitRef.current && hasLoadRef.current) {
            if (! activeRef.current) {
                setActive(true);
            }
        }

    }, [activeRef, setActive]);

    const onPagesInit = React.useCallback(() => {
        hasPagesInitRef.current = true;
        handleActive();
    }, [handleActive]);

    const onLoaded = React.useCallback(() => {
        hasLoadRef.current = true;
        handleActive();

    }, [handleActive]);

    const dispatchPDFDocMeta = React.useCallback(() => {

        if (docRef.current && docViewerRef.current) {

            const docDescriptor: IDocDescriptor = {
                // title: docRef.current.title,
                // scale: scaleRef.current,
                // scaleValue: docViewerRef.current.viewer.currentScale,
                nrPages: docRef.current.numPages,
                fingerprint: props.docMeta.docInfo.fingerprint
            };

            setDocDescriptor(docDescriptor);

            if (pageNavigatorRef.current) {
                setPage(pageNavigatorRef.current.get());
            } else {
                log.warn("No pageNavigatorRef")
            }

        }

    }, [log, props.docMeta.docInfo.fingerprint, setDocDescriptor, setPage]);

    const setScale = React.useCallback((scale: ScaleLevelTuple) => {

        if (docViewerRef.current) {
            scaleRef.current = scale;
            docViewerRef.current.viewer.currentScaleValue = scale.value;

            dispatchPDFDocMeta();

            return docViewerRef.current.viewer.currentScale;

        }

        throw new Error("No viewer");

    }, [dispatchPDFDocMeta]);

    const scaleLeveler = React.useCallback((scale: ScaleLevelTuple) => {
        return setScale(scale);
    }, [setScale]);

    const resize = React.useCallback((): number => {

        if (['page-width', 'page-fit'].includes(scaleRef.current.value)) {
            setScale(scaleRef.current);
            setStoreScale(scaleRef.current);
        }

        if (docViewerRef.current) {
            return docViewerRef.current.viewer.currentScale;
        } else {
            throw new Error("No viewer");
        }

    }, [setScale, setStoreScale]);

    const doLoad = React.useCallback(async (docViewer: DocViewer) => {

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

        docViewer.viewer.setDocument(docRef.current);
        docViewer.linkService.setDocument(docRef.current, null);

        const finder = PDFFindControllers.createFinder(docViewer.eventBus,
            docViewer.findController);
        setFinder(finder);

        docViewer.eventBus.on('pagesinit', () => {

            // PageContextMenus.start()
            annotationBarInjector();

            onPagesInit();

        });

        const resizeDebouncer = Debouncers.create(() => resize());

        window.addEventListener('resize', resizeDebouncer, {passive: true});

        document.getElementById("viewerContainer")!
            .addEventListener("resize", resizeDebouncer);

        setResizer(resizeDebouncer);

        // do first resize async
        setTimeout(() => resize(), 1 );

        async function createOutline(): Promise<IOutline | undefined> {

            function toOutline(outline: Outline): IOutlineItem {

                const id = Numbers.toString(nonceFactory());

                return {
                    id,
                    title: outline.title,
                    destination: outline.dest,
                    children: outline.items.map(toOutline)
                };

            }

            const nonceFactory = Nonces.createFactory();

            const outline = await docRef.current!.getOutline();

            if (! outline) {
                return undefined;
            }

            const items = outline.map(toOutline);
            return {items};

        }

        const outline = await createOutline();
        setOutline(outline);

        setOutlineNavigator(async (destination: any) => docViewer.linkService.goToDestination(destination as Destination));

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
        }, {passive: true});

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
        setScaleLeveler(scaleLeveler);

        function enableAutoPagemarks() {

            if (prefs.get(KnownPrefs.AUTO_PAGEMARKS).getOrElse('false') !== 'true') {
                // only enable this via prefs now...
                return;
            }

            console.log("Auto pagemarks enabled");

            function onPagemarkExtend(extendPagemark: ExtendPagemark) {

                const docMeta = docMetaProvider();

                if (! docMeta) {
                    return;
                }

                const extender = Pagemarks.createExtender(docMeta);

                // perform the mutation of the docMeta now...
                extender(extendPagemark);

                // then persist it back out..
                async function doAsync(docMeta: IDocMeta) {
                    const persistenceLayer = persistenceLayerProvider();
                    await persistenceLayer.writeDocMeta(docMeta);
                }

                doAsync(docMeta)
                    .catch(err => log.error("Unable to write docMeta: ", err));

            }

            // start the auto-pagemark system.
            Scrollers.register(onPagemarkExtend, {mode: 'full'});

        }

        enableAutoPagemarks();

        async function doUpgrade() {
            const docMeta = docMetaProvider();

            if (docMeta) {
                await pdfUpgrader(docMeta);
            }

        }

        await doUpgrade();

        onLoaded()

    }, [annotationBarInjector, dispatchPDFDocMeta, docMetaProvider, docURL, log, onLoaded,
        onPagesInit, pdfUpgrader, persistenceLayerProvider, prefs, resize, scaleLeveler,
        setDocScale, setFinder, setOutline, setOutlineNavigator, setPageNavigator,
        setResizer, setScaleLeveler]);

    React.useEffect(() => {

        if (hasLoadStartedRef.current) {
            return;
        }

        hasLoadStartedRef.current = true;

        const docID = props.docMeta.docInfo.fingerprint;
        docViewerRef.current = createDocViewer(docID);

        doLoad(docViewerRef.current)
            .catch(err => log.error("PDFDocument: Could not load PDF: ", err));

    }, [doLoad, log, props.docMeta.docInfo.fingerprint]);

    useDocumentViewerVisibleElemFocus(
        props.docMeta.docInfo.fingerprint,
        docViewerRef.current?.containerElement,
    );

    return active && (
        <>
            <AreaHighlightCreator />
            <DocumentInit/>
            {props.children}
        </>
    ) || null;

});

