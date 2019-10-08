import {Model} from '../model/Model';
import {isPresent, notNull, Preconditions} from 'polar-shared/src/Preconditions';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {ContextMenuController} from '../contextmenu/ContextMenuController';
import {KeyEvents} from '../KeyEvents';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Viewer} from '../viewer/Viewer';
import {DocTitleController} from './DocTitleController';
import {PagemarkController} from '../pagemarks/controller/PagemarkController';
import {Controller} from './Controller';
import {TextHighlightController} from '../highlights/text/controller/TextHighlightController';
import {DocFormat} from '../docformat/DocFormat';
import {AreaHighlightController} from '../highlights/area/controller/AreaHighlightController';
import {PagemarkCoverageEventListener} from '../pagemarks/controller/PagemarkCoverageEventListener';
import {DocDetails} from '../metadata/DocDetails';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ClipboardCleanser} from '../ui/ClipboardCleanser';


const log = Logger.create();

export class WebController extends Controller {

    protected viewer: Viewer;

    /**
     * The document fingerprint that we have loaded to detect when the
     * documents have changed.  Note that this isn't a secure fingerprint
     * so we might want to change it in the future.
     */
    private docFingerprint?: string;

    private readonly docFormat: DocFormat;

    constructor(model: Model, viewer: Viewer) {

        super(Preconditions.assertNotNull(model, "model"));

        this.viewer = Preconditions.assertNotNull(viewer, "viewer");

        this.docFormat = notNull(DocFormatFactory.getInstance());

        new PagemarkController(model).start();
        new DocTitleController(this.model).start();
        ClipboardCleanser.register();
    }

    public async start() {

        this.listenForDocumentLoad();
        await this.listenForKeyBindings();

        // new MouseTracer(document).start();

        if (this.docFormat.name === 'pdf') {
            this.detectDocumentLoaded('start');
        }

    }

    public async dispatchDocumentLoaded(fingerprint: string,
                                        nrPages: number,
                                        currentlySelectedPageNum: number) {

        const docDetail = this.viewer.docDetail();

        await super.onDocumentLoaded(fingerprint,
                                     nrPages,
                                     currentlySelectedPageNum,
                                     docDetail);

        log.info("Merging docDetail: ", docDetail);

        // TODO: move this into the importer to create the DocMeta once the
        // PHZ is created which also means this can be tested easily.
        DocDetails.merge(this.model.docMeta.docInfo, docDetail);

        this.setupWindowWidth();

        this.setupDocumentTitle();

        this.setupContextMenu();

    }

    public setupWindowWidth() {

        const viewerClientWidth = Optional.of(document.querySelector("#viewerContainer"))
            .map(current => current.clientWidth)
            .getOrElse(0);


        const viewerScrollWidth = Optional.of(document.querySelector("#viewerContainer"))
            .map(current => current.scrollWidth)
            .getOrElse(0);

        const needsResize = viewerScrollWidth > viewerClientWidth;

        if (needsResize) {

            const sidebarScrollWidth = Optional.of(document.querySelector("#sidebarContainer"))
                .map(current => current.scrollWidth)
                .getOrElse(0);

            const bufferWidth = 50;

            const newWidth = sidebarScrollWidth + viewerScrollWidth + bufferWidth;

            if (newWidth > window.outerWidth) {
                window.resizeTo(newWidth, window.outerHeight);
            }

        }

    }

    public setupDocumentTitle() {

        const title = Optional.of(this.model.docMeta.docInfo.title).getOrElse("Untitled");

        document.title = `${title}`;

    }

    public setupContextMenu() {

        const contextMenuController = new ContextMenuController(this.model);
        contextMenuController.start();

    }

    public listenForDocumentLoad() {

        const container = notNull(document.getElementById('viewerContainer'));

        for (const eventName of ['pagesinit', 'updateviewarea']) {
            container.addEventListener(eventName, (event) => this.detectDocumentLoaded(eventName));

        }

        // run manually the first time in case we get lucky of we're running HTML
        // this.detectDocumentLoadedEventListener();

    }

    private detectDocumentLoaded(eventName: string) {

        // TODO: technically we're detecting a new document LOADING not LOADED...
        // fix this so that I get a distinct onDocumentLoaded event too...

        const currentDocFingerprint = this.docFormat.currentDocFingerprint();

        if (currentDocFingerprint !== undefined && currentDocFingerprint !== this.docFingerprint) {

            log.info("controller: New document loaded: " + eventName);

            const newDocumentFingerprint = currentDocFingerprint;

            const currentDocState = this.docFormat.currentState();

            this.onNewDocumentFingerprint(newDocumentFingerprint, currentDocState.nrPages, currentDocState.currentPageNumber);

        }

    }

    public onNewDocumentFingerprint(newDocumentFingerprint: string, nrPages: number, currentPageNumber: number) {

        log.info(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages}, currentPageNumber=${currentPageNumber})`);

        this.docFingerprint = newDocumentFingerprint;

        this.dispatchDocumentLoaded(newDocumentFingerprint, nrPages, currentPageNumber)
            .catch(err => log.error("Could not handle onDocumentLoaded: ", err));

    }

    public async keyBindingPagemarkEntirePage(event: KeyboardEvent) {

        log.info("Marking entire page as read.");

        const pageElement = this.docFormat.getCurrentPageElement();

        if (pageElement) {

            const pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            this.erasePagemarks(pageNum);
            await this.createPagemark(pageNum);

        } else {
            log.warn("No current pageElement to create pagemark.");
        }

    }

    public keyBindingErasePagemark() {
        log.info("Erasing pagemark.");
        const pageElement = <HTMLElement> this.docFormat.getCurrentPageElement();

        if (isPresent(pageElement)) {
            const pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
            this.erasePagemark(pageNum);
        }

    }

    public async keyBindingListener(event: KeyboardEvent) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if (event.key) {

                // TODO: we should not use 'code' but should use 'key'... The
                // problem is that on OS X the key code returned 'Dead' but was
                // working before.  Not sure why it started breaking.
                switch (event.code) {

                    case "KeyE":
                        this.keyBindingErasePagemark();
                        break;

                    case "KeyN":
                        await this.keyBindingPagemarkEntirePage(event);
                        break;

                    default:
                        break;

                }

            }

        } else {
            // noop
        }

    }

    public async listenForKeyBindings() {

        document.addEventListener("keydown", this.keyBindingListener.bind(this));

        log.info("Key bindings registered");

        new TextHighlightController(this.model).start();

        new PagemarkCoverageEventListener(this, this.model).start();

        // new FlashcardsController(this.model).start();

        // await new AnnotationsController().start();

        new AreaHighlightController(this.model).start();

    }

}
