import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";
import ePub, {EpubCFI} from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNavigator} from "../../PageNavigator";
import {Resizer, useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from 'epubjs/types/section';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";
import {IFrameEventForwarder} from "./IFrameEventForwarder";
import {SCALE_VALUE_PAGE_WIDTH} from '../../ScaleLevels';
import {useAnnotationBar} from '../../AnnotationBarHooks';
import './EPUBDocument.css';
import {DocumentInit} from "../DocumentInitHook";
import {DOMTextIndexProvider} from "../../annotations/DOMTextIndexContext";
import {
    useEPUBDocumentCallbacks,
    useEPUBDocumentStore
} from './EPUBDocumentStore';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import {Arrays} from 'polar-shared/src/util/Arrays';
import {Latch} from "polar-shared/src/util/Latch";
import {useWindowResizeEventListener} from "../../../../../web/js/react/WindowHooks";
import {IDimensions} from 'polar-shared/src/util/IDimensions';
import {EPUBContextMenuRoot} from "./contextmenu/EPUBContextMenuRoot";
import {
    FluidPagemarkCreateOpts,
    FluidPagemarkFactory,
    IFluidPagemark
} from "../../FluidPagemarkFactory";
import {IPagemarkRange} from "polar-shared/src/metadata/IPagemarkRange";
import {useStylesheetURL} from "./EPUBDocumentHooks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {AnnotationLinks} from "../../../../../web/js/annotation_sidebar/AnnotationLinks";
import useEPUBFindController = EPUBFindControllers.useEPUBFindController;
import {IPagemarkAnchor} from "polar-shared/src/metadata/IPagemarkAnchor";
import {
    LinkLoaderDelegate,
    useNav
} from "../../../../../web/js/ui/util/NavHook";

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

// FIXME how do I pre-filter the HTML to reject XSS attacks...

function forwardEvents(target: HTMLElement) {
    // this is needed because keyboard events and other events ould be swallowed
    // by the iframe.

    const iframe = target.querySelector('iframe')! as HTMLIFrameElement;
    IFrameEventForwarder.start(iframe, target);
}

function handleLinkClicks(target: HTMLElement, linkLoader: LinkLoaderDelegate) {

    const iframe = target.querySelector('iframe')! as HTMLIFrameElement;
    const links = Array.from(iframe.contentDocument!.querySelectorAll('a'));

    for (const link of links) {

        link.addEventListener('click', (event) => {

            const href = link.getAttribute('href');

            if (!href) {
                return;
            }

            if (! href.startsWith('http')) {
                return;
            }

            console.log("linkClicked: ", href);

            linkLoader(href, {focus: true, newWindow: true});

            event.stopPropagation();
            event.preventDefault();

        });

    }
}

export const EPUBDocument = (props: IProps) => {

    const {docURL, docMeta} = props;

    const {setDocDescriptor, setPageNavigator, setDocScale, setResizer, setFluidPagemarkFactory, setPage}
        = useDocViewerCallbacks();

    const {setFinder}
        = useDocFindCallbacks();

    const {renderIter}
        = useEPUBDocumentStore(['renderIter'])

    const {incrRenderIter, setSection}
        = useEPUBDocumentCallbacks()

    const finder = useEPUBFindController();
    const annotationBarInjector = useAnnotationBar({noRectTexts: true});
    const docViewerElements = useDocViewerElementsContext();
    const epubResizer = useEPUBResizer();
    const log = useLogger();
    const sectionRef = React.useRef<Section | undefined>(undefined);
    const stylesheet = useStylesheetURL();
    const linkLoader = useNav();

    async function doLoad() {

        function doInitialCallbacks() {

            setFinder(finder);

            // the doc scale needs to be set to that we're 1.0 as epub doesn't support
            // scale just yet.
            setDocScale({scale: SCALE_VALUE_PAGE_WIDTH, scaleValue: 1.0});

        }

        doInitialCallbacks();

        const book = ePub(docURL);

        const pageElement = Arrays.first(docViewerElements.getPageElements());

        if (! pageElement) {
            throw new Error("No page element");
        }

        // TODO:
        //
        // test no width but set the iframe CSS style to width

        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            resizeOnOrientationChange: false,
            stylesheet,
            // height: '100%',
            // layout: 'pre-paginated'
        });

        rendition.on('locationChanged', (event: any) => {
            // noop... this is called when the location of the book is changed
            // so we can use it to re-attach annotations.

            console.log('epubjs event: locationChanged', event);

        });

        function createResizer(): Resizer {
            return () => {
                epubResizer()
            };
        }

        const resizer = createResizer();
        setResizer(resizer);

        rendition.on('resize', (event: any) => {
            console.error("epubjs event: resize", new Error("FAIL: this should not happen"));
        });

        rendition.on('resized', (event: any) => {
            console.error("epubjs event: resized", new Error("FAIL: this should not happen"));
        });

        rendition.on('rendered', (section: Section) => {
            console.log('epubjs event: rendered: ');

            epubResizer();

            // we have to update the section here as we jumped within the EPUB
            // directly.
            handleSection(section);

            forwardEvents(pageElement);
            handleLinkClicks(pageElement, linkLoader);

            // applyCSS();
            annotationBarInjector();

            incrRenderIter();

        });

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        // the 'pages' are sections that are defined as 'linear' in the spine.
        // and the rest are not pages.
        const pages = spine.items.filter(current => current.linear);

        function handleSection(section: Section) {

            function computePageNumberFromSection(): number | undefined {

                const sectionIndex
                    = arrayStream(pages)
                        .withIndex()
                        .filter(current => current.value.index === section.index)
                        .first();

                return sectionIndex?.index ? sectionIndex?.index + 1: undefined;

            }

            setSection(section);
            sectionRef.current = section;

            const pageNumberFromSection = computePageNumberFromSection();

            if (pageNumberFromSection) {
                setPage(pageNumberFromSection);
            }

        }

        function createPageNavigator(): PageNavigator {

            let page: number = 1;
            const count = pages.length;

            function get(): number {
                return page;
            }

            async function jumpToPage(newPage: number) {

                page = newPage;

                const newSection = pages[newPage - 1];

                async function displayAndWaitForRender() {

                    // we need to use a latch here because the page isn't really
                    // change until it's rendered and other dependencies might
                    // need to wait like highlights that depend on the page being
                    // shown.
                    const renderedLatch = new Latch<boolean>();
                    rendition.once('rendered', () => renderedLatch.resolve(true))
                    await rendition.display(newSection.index)
                    await renderedLatch.get();

                }

                function updateURL() {
                    document.location.hash = '#page=' + newPage;
                }

                await displayAndWaitForRender();
                handleSection(newSection);
                updateURL();

            }

            return {count, jumpToPage, get};

        }

        function createFluidPagemarkFactory(): FluidPagemarkFactory {

            function create(opts: FluidPagemarkCreateOpts): IFluidPagemark | undefined {

                if (! opts.range) {
                    return undefined;
                }

                const cfiBase = sectionRef.current!.cfiBase;
                const epubCFI = new EpubCFI(opts.range, cfiBase);

                const anchor: IPagemarkAnchor = {
                    type: 'epubcfi',
                    value: epubCFI.toString()
                };

                function computeRange(): IPagemarkRange | undefined {
                    switch(opts.direction) {
                        case "top":
                            return {
                                start: anchor,
                                end: opts.existing?.range?.end
                            };
                        case "bottom":
                            return {
                                start: opts.existing?.range?.start,
                                end: anchor
                            };
                        default:
                            return {
                                start: opts.existing?.range?.start,
                                end: anchor
                            };

                    }
                }

                const range = computeRange();

                if (! range) {
                    return undefined;
                }

                return {range}

            }

            return {create};

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        // define the fluid pagemark factor so that the menu can use this
        // when creating pagemarks.
        const fluidPagemarkFactory = createFluidPagemarkFactory();
        setFluidPagemarkFactory(fluidPagemarkFactory);

        const annotationLink = AnnotationLinks.parse(document.location);

        await pageNavigator.jumpToPage(annotationLink?.page || 1);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        const metadata = await book.loaded.metadata;

        console.log({metadata});

        const navigation = await book.loaded.navigation;

        console.log("landmarks: ", navigation.landmarks);

        console.log("toc: ", navigation.toc);

        const pageList = await book.loaded.pageList;

        console.log("pageList: ", pageList);

        const manifest = await book.loaded.manifest;

        console.log("manifest: ", manifest);

        console.log("Loaded epub");

    }

    useWindowResizeEventListener(epubResizer);

    useComponentDidMount(() => {
        doLoad()
            .catch(err => log.error("Could not load EPUB: ", err));
    })

    return renderIter && (
        <DOMTextIndexProvider>
            <DocumentInit/>
            <EPUBFindRenderer/>
            <EPUBContextMenuRoot/>
            {props.children}
        </DOMTextIndexProvider>
    ) || null;

};


function useEPUBResizer() {

    const docViewerElements = useDocViewerElementsContext();

    return () => {

        const docViewer = docViewerElements.getDocViewerElement();

        function computeContainerDimensions(): IDimensions {
            const element = docViewer.querySelector(".page") as HTMLElement;
            const width = element!.offsetWidth;
            const height = element!.offsetHeight;
            return {width, height}
        }

        function setWidth(element: HTMLElement, dimensions: IDimensions) {
            element.style.width = `${dimensions.width}px`;
            element.style.height = `${dimensions.height}px`;
        }

        function adjustEpubView(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view") as HTMLElement;
            if (element){
                setWidth(element, dimensions);
            }
        }

        function adjustIframe(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view iframe") as HTMLElement;
            setWidth(element, dimensions);
        }

        function adjustIframeBody(dimensions: IDimensions) {
            const iframe = docViewer.querySelector(".epub-view iframe") as HTMLIFrameElement;
            setWidth(iframe.contentDocument!.body, dimensions);


            // this epub padding and I can't figure out where    this is being set.
            // iframe.contentDocument!.documentElement.style.padding = '0';
            // iframe.contentDocument!.body.style.padding = '5px';

            iframe.contentDocument!.body.style.width = 'auto';
            iframe.contentDocument!.body.style.height = 'auto';

        }

        const dimensions = computeContainerDimensions();
        adjustEpubView(dimensions);
        adjustIframe(dimensions);
        adjustIframeBody(dimensions);

        console.log("Resized to dimensions: ", dimensions);

    }

}
