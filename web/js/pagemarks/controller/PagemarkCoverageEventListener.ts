import {WebController} from '../../controller/WebController';
import {Model} from '../../model/Model';
import {DocFormat} from '../../docformat/DocFormat';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocFormatFactory} from '../../docformat/DocFormatFactory';
import {KeyEvents} from '../../KeyEvents';
import {Elements} from '../../util/Elements';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Percentages} from '../../util/Percentages';
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {DocMetas} from '../../metadata/DocMetas';

const log = Logger.create();

export class PagemarkCoverageEventListener {

    private readonly controller: WebController;
    private readonly model: Model;

    private keyActivated: boolean = false;

    private readonly docFormat: DocFormat;

    /**
     */
    constructor(controller: WebController, model: Model) {
        this.controller = controller;
        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();
    }

    public start() {

        log.info("Starting...");

        this.model.registerListenerForDocumentLoaded(() => this.onDocumentLoaded());
        window.addEventListener("message", event => this.onMessageReceived(event), false);

        log.info("Starting...done");

    }

    // for message send from the context menu
    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        const triggerEvent = event.data;

        switch (event.data.type) {

            case "create-pagemark-to-point":
                this.onContextMenuCreatePagemarkToPoint(triggerEvent)
                    .catch(err => log.error(err));
                break;

        }

    }

    private onDocumentLoaded() {

        log.info("Document loaded... installing listeners...");

        document.addEventListener("keyup", event => this.keyListener(event));
        document.addEventListener("keydown", event => this.keyListener(event));

        const pageElements: HTMLElement[]
            = Array.from(document.querySelectorAll(".page"));

        for (const pageElement of pageElements) {
            pageElement.addEventListener("click", event => this.mouseListener(event));
        }

        if (pageElements.length === 0) {
            log.warn("No pages found for click listener.");
        } else {
            log.debug("Added click listener to N pages: " + pageElements.length);
        }

        log.info("Document loaded... installing listeners...done");

    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    private keyListener(event: KeyboardEvent) {

        if (!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

    }

    private async mouseListener(event: MouseEvent) {

        if (!event) {
            throw new Error("no event");
        }

        if (!this.keyActivated) {
            return;
        }

        await this.onMouseEventCreatePagemarkToPoint(event);

    }

    private async onContextMenuCreatePagemarkToPoint(triggerEvent: TriggerEvent) {

        try {

            const pageElement = this.docFormat.getPageElementFromPageNum(triggerEvent.pageNum);
            const pageNum = triggerEvent.pageNum;
            const verticalOffsetWithinPageElement = triggerEvent.points.pageOffset.y;

            this.createPagemarkAtPoint(pageNum, pageElement, verticalOffsetWithinPageElement)
                .catch(err => log.error("Failed to create pagemark: ", err));

        } finally {
            RendererAnalytics.event({category: 'user', action: 'created-pagemark-via-context-menu'});
        }

    }

    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    private async onMouseEventCreatePagemarkToPoint(event: MouseEvent) {

        try {

            // this should always be .page since we're using currentTarget
            const pageElement = Elements.untilRoot(<HTMLElement> event.currentTarget, ".page");
            const pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
            const eventTargetOffset = Elements.getRelativeOffsetRect(<HTMLElement> event.target, pageElement);
            const verticalOffsetWithinPageElement = eventTargetOffset.top + event.offsetY;

            this.createPagemarkAtPoint(pageNum, pageElement, verticalOffsetWithinPageElement)
                .catch(err => log.error("Failed to create pagemark: ", err));

        } finally {
            RendererAnalytics.event({category: 'user', action: 'created-pagemark-via-keyboard'});
        }

    }

    private async createPagemarkAtPoint(pageNum: number,
                                        pageElement: HTMLElement,
                                        verticalOffsetWithinPageElement: number) {

        const pageHeight = pageElement.clientHeight;

        const percentage = Percentages.calculate(verticalOffsetWithinPageElement, pageHeight, {noRound: true});

        log.info("percentage for pagemark: ", percentage);

        const docMeta = this.model.docMeta;

        await DocMetas.withBatchedMutations(docMeta, async () => {
            this.model.erasePagemark(pageNum);
            await this.model.createPagemarksForRange(pageNum, percentage);
        });

    }

}
