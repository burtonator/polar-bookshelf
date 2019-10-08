import {Model} from '../../model/Model';
import {Logger} from 'polar-shared/src/logger/Logger';
import {forDict} from 'polar-shared/src/util/Functions';
import {DocMetaDescriber} from '../../metadata/DocMetaDescriber';
import {DocMetas} from '../../metadata/DocMetas';

const log = Logger.create();

/**
 * Updates our progress as we read the doc.
 */
export class ProgressView {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public start() {

        log.info("Starting...");

        this.model.registerListenerForDocumentLoaded(documentLoadedEvent => {

            log.info("onDocumentLoaded");

            const docMeta = documentLoadedEvent.docMeta;

            forDict(docMeta.pageMetas, (key, pageMeta) => {

                pageMeta.pagemarks.addTraceListener(() => {
                    this.update();
                });

            });

        });

    }

    public update() {

        // TODO: this should listen directly to the model and the pagemarks
        // themselves.

        const perc = DocMetas.computeProgress(this.model.docMeta);

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

}
