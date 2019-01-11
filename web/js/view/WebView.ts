import {Model} from '../model/Model';
import {View} from './View';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocFormat} from '../docformat/DocFormat';
import {DocMetaDescriber} from '../metadata/DocMetaDescriber';
import {forDict} from '../util/Functions';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class WebView extends View {

    private readonly docFormat: DocFormat;

    /**
     *
     * @param model {Model}
     */
    constructor(model: Model) {
        super(model);

        this.docFormat = DocFormatFactory.getInstance();

    }

    public start() {

        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        return this;

    }

    /**
     * @deprecated Moved to pagemark.ProgressView... remove this code.
     */
    public updateProgress() {

        // TODO: this should listen directly to the model and the pagemarks
        // themselves.

        const perc = this.computeProgress(this.model.docMeta);

        log.info("Percentage is now: " + perc);

        const progressElement = <HTMLProgressElement> document.querySelector("#polar-progress progress");
        progressElement.value = perc;

        // now update the description of the doc at the bottom.

        const description = DocMetaDescriber.describe(this.model.docMeta);

        const docOverview = document.querySelector("#polar-doc-overview");

        if (docOverview) {
            docOverview.textContent = description;
        }

    }

    /**
     * @deprecated Moved to pagemark.ProgressView... remove this code.
     */
    computeProgress(docMeta: DocMeta) {

        // I think this is an issue of being async maybel?

        let total = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (column, pagemark) => {

                total += pagemark.percentage;

            });

        });

        const perc = total / (docMeta.docInfo.nrPages * 100);

        return perc;
    }

    /**
     * Setup a document once we detect that a new one has been loaded.
     */
    onDocumentLoaded() {

        log.info("WebView.onDocumentLoaded: ", this.model.docMeta);

        this.updateProgress();

    }

}

