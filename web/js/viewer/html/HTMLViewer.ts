import $ from '../../ui/JQuery';
import {Viewer} from '../Viewer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {notNull} from 'polar-shared/src/Preconditions';
import {Model} from '../../model/Model';
import {PHZMetadata} from '../../phz/PHZMetadata';
import {DocDetail} from '../../metadata/DocDetail';
import {LinkHandler} from './LinkHandler';
import {Services} from '../../util/services/Services';
import {HTMLFormat} from '../../docformat/HTMLFormat';
import {FrameInitializer} from './FrameInitializer';
import {BackgroundFrameResizer} from './BackgroundFrameResizer';
import {Descriptors} from './Descriptors';
import {IFrameWatcher} from './IFrameWatcher';
import {FrameResizer} from './FrameResizer';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {DocMetas} from '../../metadata/DocMetas';
import {DirectPHZLoader} from '../../phz/DirectPHZLoader';
import {LoadStrategy} from '../../apps/main/file_loaders/PHZLoader';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Captured} from '../../capture/renderer/Captured';
import {IFrames} from '../../util/dom/IFrames';
import {Documents} from './Documents';

const log = Logger.create();

const ENABLE_VIDEO = true;

export class HTMLViewer extends Viewer {

    private content: HTMLIFrameElement = document.createElement('iframe');

    private contentParent: HTMLElement = document.createElement('div');

    private textLayer: HTMLElement = document.createElement('div');

    private htmlFormat: any;

    private frameResizer?: FrameResizer;

    private readonly model: Model;

    private loadStrategy: LoadStrategy | undefined;

    // tslint:disable-next-line:variable-name
    private _docDetail: ExtendedDocDetail | undefined;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    public start() {

        log.info("Starting HTMLViewer");

        this.content = <HTMLIFrameElement> document.querySelector("#content");
        this.contentParent = <HTMLElement> document.querySelector("#content-parent");
        this.textLayer = <HTMLElement> document.querySelector(".textLayer");

        this.htmlFormat = new HTMLFormat();

        RendererAnalytics.pageview("/htmlviewer");

        // *** start the resizer and initializer before setting the iframe

        this.loadStrategy = LoadStrategies.loadStrategy();

        const onReady = async () => {

            this._captureBrowserZoom();

            const docDetail = this._docDetail = await this.doLoad();

            this.frameResizer = new FrameResizer(this.contentParent, this.content);

            const onIFrameLoaded = () => {

                log.info("Loading page now...");

                const backgroundFrameResizer
                    = new BackgroundFrameResizer(this.contentParent,
                                                 this.content,
                                                 () => this.onResized());

                backgroundFrameResizer.start();

                const frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

                this.startHandlingZoom();

                this.configurePageDimensions(docDetail);

            };

            new IFrameWatcher(this.content, () => onIFrameLoaded())
                .start();

            window.addEventListener("resize", () => {
                this.doZoom();
                this.frameResizer!.resize(true)
                    .catch(err => log.error("Unable to resize: ", err));

            });

            await Services.start(new LinkHandler(this.content));

        };

        $(document).ready(() => {
            onReady()
                .catch(err => log.error("Could not load doc: ", err));
        });

    }

    private onResized() {

        const docMeta = this.model.docMeta;

        const pageMeta = DocMetas.getPageMeta(docMeta, 1);

        if (! pageMeta.pageInfo.dimensions) {

            const width = this.content.offsetWidth;
            const height = this.content.offsetHeight;

            pageMeta.pageInfo.dimensions = {width, height};

        }

        // ViewerScreenshots.doScreenshot();

    }

    private _captureBrowserZoom() {

        // TODO: for now this is used to just capture and disable zoom but
        // we should enable it in the future so we can handle zoom ourselves.

        $(document).keydown(function(event: KeyboardEvent) {

            // TODO: use the code here not the 'which'
            if (event.ctrlKey && (event.which === 61 ||
                                  event.which === 107 ||
                                  event.which === 173 ||
                                  event.which === 109 ||
                                  event.which === 187 ||
                                  event.which === 189 ) ) {

                log.info("Browser zoom detected. Preventing.");
                event.preventDefault();

            }
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/= key
        });

        $(window).bind('mousewheel DOMMouseScroll', function(event: MouseEvent) {

            if (event.ctrlKey) {

                log.info("Browser zoom detected. Preventing.");
                event.preventDefault();

            }

        });
    }

    private startHandlingZoom() {

        $(".polar-zoom-select")
            .change(() => {
                this.doZoom();
            });
    }

    /**
     * Get the page width from the descriptor if it's present and use that.
     *
     * Otherwise, use the defaults.
     */
    private configurePageDimensions(docDetail: ExtendedDocDetail) {

        log.info("Loading with descriptor: ", docDetail.metadata);

        const docDimensions = Descriptors.calculateDocDimensions(docDetail.metadata);

        log.info(`Configuring page with width=${docDimensions.width} and minHeight=${docDimensions.minHeight}`);

        document.querySelectorAll("#content-parent, .page, iframe").forEach(element => {
            (element as HTMLElement).style.width = `${docDimensions.width}px`;
        });

        document.querySelectorAll(".page, iframe").forEach((element) => {

            const htmlElement = element as HTMLElement;
            const minHeightElement = htmlElement.parentElement!;

            minHeightElement.style.minHeight = `${docDimensions.minHeight}px`;

        });

    }

    public doZoom() {

        const selectElement: HTMLSelectElement | null
            = document.querySelector(".polar-zoom-select");

        if (selectElement === null) {
            console.log("No select");
            return;
        }

        const zoom = selectElement.options[selectElement.selectedIndex].value;

        this.changeScale(parseFloat(zoom));

        // make sure the select doesn't have focus so that we can scroll.
        selectElement.blur();

    }

    public changeScale(scale: number) {

        log.info("Changing scale to: " + scale);

        this._changeScaleMeta(scale);
        this._changeScale(scale);
        this._removeAnnotations();
        this._signalScale();

    }

    private _changeScaleMeta(scale: number) {

        const metaElement = notNull(document.querySelector("meta[name='polar-scale']"));

        metaElement.setAttribute("content", `${scale}`);

    }

    private _changeScale(scale: number) {

        // NOTE: removing the iframe and adding it back in fixed a major problem
        // with font fuzziness on Chrome/Electron.  Technically it should be
        // possible to resize the iframe via scale alone but I don't think
        // chrome re-renders the fonts unless significant scale changes are
        // made.

        // const iframe = notNull(document.querySelector("iframe"));
        // const iframeParentElement = iframe.parentElement;

        // TODO: we were experimenting with adding+removing the child iframes
        // but decided to back out the code as it was de-activating the iframes
        // and I couldn't click on them.

        // iframeParentElement.removeChild(iframe);

        // TODO: run an algorithm to make sure there are no elements between
        // two paths in the DOM that have any scrollHeight > their height.

        const contentParent = notNull(document.querySelector("#content-parent"));
        (contentParent as HTMLElement).style.transform = `scale(${scale})`;

        const height = parseInt(this.content.getAttribute('data-original-height')!);
        const newHeight = height * scale;

        this.frameResizer!.resize(true, newHeight)
            .catch(err => log.error("Unable to change scale: ", err));

    }

    private _removeAnnotations() {
        // remove all annotations from the .page. they will be re-created by
        // all the views. The PDF viewer does this for us automatically.

        document.querySelectorAll(".page .annotation").forEach(function(annotation) {
            (annotation.parentElement as HTMLElement).removeChild(annotation);
        });

    }

    // remove and re-inject an endOfContent element to trigger the view to
    // re-draw pagemarks.
    private _signalScale() {

        log.info("HTMLViewer: Signaling rescale.");

        const pageElement = notNull(document.querySelector(".page"));
        let endOfContent = notNull(pageElement.querySelector(".endOfContent"));

        notNull(notNull(endOfContent).parentElement).removeChild(endOfContent);

        endOfContent = document.createElement("div");
        endOfContent.setAttribute("class", "endOfContent" );

        pageElement.appendChild(endOfContent);

    }

    /**
     * Load the actual content for the page.
     */
    private async doLoad(): Promise<ExtendedDocDetail> {

        // *** now setup the iframe

        const file = Optional.of(this.getFile()).getOrElse("example1.html");

        const toStrategyHandler = () => {

            if (this.loadStrategy === 'portable') {
                return new PortableStrategyHandler();
            } else {
                return new ElectronStrategyHandler();
            }

        };

        const strategyHandler = toStrategyHandler();

        const docDetail = await strategyHandler.doLoad(this.content, file);

        // TODO: improve this so that we can detect if this is a Youtube video
        // embed safely.
        // if (ENABLE_VIDEO && file.indexOf("youtube.com/") !== -1) {
            // // TODO: better regex for this in the future.
            //
            // const embedHTML = HTMLViewer.createYoutubeEmbed(file,
            // this.content);  this.content.contentDocument!.body.innerHTML =
            // embedHTML;
            // this.content.contentWindow!.history.pushState({"html":
            // embedHTML, "pageTitle": 'Youtube Embed'}, "", file);

        // } else {

        // }

        const fingerprint = docDetail.fingerprint;

        if (!fingerprint) {
            throw new Error("Fingerprint is required");
        }

        this.htmlFormat.setCurrentDocFingerprint(fingerprint);

        return docDetail;

    }

    private static createYoutubeEmbed(url: string, content: HTMLIFrameElement) {

        const DEFAULT_WIDTH = 560;
        const DEFAULT_HEIGHT = 315;

        const width = content.contentDocument!.body.offsetWidth;
        const height = (DEFAULT_HEIGHT / DEFAULT_WIDTH) * width;

        // get the video ID from a URL like:
        //
        // https://www.youtube.com/watch?v=CP1BVpF-NjY

        const u = new URL(url);
        const videoID = u.searchParams.get('v');

        return `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    public docDetail(): DocDetail | undefined {
        return this._docDetail;
    }

}


class LoadStrategies {

    /**
     * Get the request params as a dictionary.
     */
    public static loadStrategy(): LoadStrategy {

        const url = new URL(window.location.href);

        const strategy = url.searchParams.get("strategy");
        return <LoadStrategy> Optional.of(strategy).getOrElse("electron");

    }

}

abstract class StrategyHandler {

    public abstract async doLoad(content: HTMLIFrameElement, file: string): Promise<ExtendedDocDetail>;

    protected getFilename(): string {
        const url = new URL(window.location.href);
        return notNull(url.searchParams.get("filename"));
    }

    protected getFingerprint(): string {
        const url = new URL(window.location.href);
        return notNull(url.searchParams.get("fingerprint"));
    }


}

class PortableStrategyHandler extends StrategyHandler {

    public async doLoad(content: HTMLIFrameElement, file: string): Promise<ExtendedDocDetail> {

        const loader = await DirectPHZLoader.create(file);
        const captured = await loader.load();

        if (! captured.isPresent()) {
            throw new Error("Unable to load page (no captured data)");
        }

        const url = captured.get().url;

        IFrames.markLoadedManually(content, url);

        return {
            fingerprint: this.getFingerprint(),
            title: captured.get().title,
            url,
            nrPages: 1,
            filename: this.getFilename(),
            metadata: captured.get()
        };

    }


}

class ElectronStrategyHandler extends StrategyHandler  {

    public async doLoad(content: HTMLIFrameElement, file: string): Promise<ExtendedDocDetail> {
        content.src = file;
        return this.docDetail();
    }

    public docDetail(): ExtendedDocDetail {

        const url = new URL(window.location.href);
        const metadata: Captured = JSON.parse(notNull(url.searchParams.get("descriptor")));

        return {
            fingerprint: this.getFingerprint(),
            title: metadata.title,
            url: metadata.url,
            nrPages: 1,
            filename: this.getFilename(),
            metadata
        };

    }

}

interface ExtendedDocDetail extends DocDetail {
    metadata: Captured;
}

