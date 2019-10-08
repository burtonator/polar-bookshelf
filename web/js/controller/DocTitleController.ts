/**
 * Handles attaching events to the title UI and prompting for new titles.
 */
import {DocumentLoadedEvent, Model} from '../model/Model';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../ui/toaster/Toaster';
import {Strings} from "polar-shared/src/util/Strings";

const log = Logger.create();

export class DocTitleController {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public start() {

        // this.listenForDocumentLoad();
        this.listenForTitle();

        // TODO listen to paste so that if they paste \n so we escape it...
        // I think we can do this if we listen to 'change' not 'keydown'.

    }

    private listenForDocumentLoad() {

        this.model.registerListenerForDocumentLoaded(async event => {
            await this.onDocumentLoaded(event);
        });

    }

    private listenForTitle() {

        // bind to keyDown so I can listen for enter to change the title

        const inputElement = <HTMLElement> document.querySelector("#set-title input")!;
        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {

            if( event.key === 'Enter') {
                log.info("Updating document metadata now");
                this.doUpdateTitle();
                this.hideTitlePrompt();
            }

        });

    }

    private async onDocumentLoaded(event: DocumentLoadedEvent) {

        if(Strings.empty(event.docMeta.docInfo.title)) {
            this.triggerTitlePrompt();
        }

    }

    private doUpdateTitle() {

        const inputElement = <HTMLInputElement> document.querySelector("#set-title input")!;

        const title = inputElement.value;

        log.info("Setting title to: " + title);

        this.model.docMeta.docInfo.title = title;

        Toaster.success("Document title successfully updated");

    }

    private triggerTitlePrompt() {

        log.info("Triggering title prompt");
        this.showTitlePrompt();

    }

    private hideTitlePrompt() {
        $('#set-title').hide();

    }

    private showTitlePrompt() {
        $('#set-title').show();
    }

}
