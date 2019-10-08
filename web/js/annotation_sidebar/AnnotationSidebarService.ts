import {DocumentLoadedEvent, Model} from '../model/Model';
import {AnnotationSidebars} from './AnnotationSidebars';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Splitter} from '../ui/splitter/Splitter';
import {LocalPrefs} from '../util/LocalPrefs';

const log = Logger.create();

const PREF_SIDEBAR_OPEN = 'annotation-sidebar-open';

export class AnnotationSidebarService {

    private readonly model: Model;

    private splitter?: Splitter;

    public constructor(model: Model) {
        this.model = model;
    }

    public start() {

        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        if (! LocalPrefs.defined(PREF_SIDEBAR_OPEN)) {
            // make the sidebar open by default now so we can make this feature
            // more discoverable.
            LocalPrefs.mark(PREF_SIDEBAR_OPEN);
        }

        return this;

    }

    private onDocumentLoaded(event: DocumentLoadedEvent) {

        log.debug("Creating annotation sidebar");
        this.splitter = AnnotationSidebars.create(event.docMeta,
                                                  this.model.persistenceLayerProvider);

        if (LocalPrefs.isMarked(PREF_SIDEBAR_OPEN)) {
            this.splitter.expand();
        } else {
            this.splitter.collapse();
        }

    }

    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        switch (event.data.type) {

            case "toggle-annotation-sidebar":
                this.toggleAnnotationSidebar();
                break;

        }

    }

    private toggleAnnotationSidebar() {

        const state = this.splitter!.toggle();

        if (state === 'expanded') {
            LocalPrefs.mark(PREF_SIDEBAR_OPEN);
        } else {
            LocalPrefs.mark(PREF_SIDEBAR_OPEN, false);
        }

    }

}
