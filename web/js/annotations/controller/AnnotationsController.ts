import {DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from 'polar-shared/src/logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {Nullable} from '../../util/ts/Nullable';
import {AnnotationTriggerEvents} from './AnnotationTriggerEvents';
import {IPCClient} from '../../ipc/handler/IPCClient';
import {IPCEvent} from '../../ipc/handler/IPCEvent';
import {Toaster} from '../../ui/toaster/Toaster';

const log = Logger.create();

/**
 * Controller used to listen for the context menu (and key bindings) for
 * creating specific annotation types.
 *
 * @ElectronMainContext
 */
export class AnnotationsController {

    flashcardDialogWindow = new Nullable<DialogWindowClient>();

    ipcClient = new Nullable<IPCClient<IPCEvent>>();

    public async start(): Promise<void> {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        const dialogWindowClient = await this.createDialogWindow();
        this.flashcardDialogWindow.set(dialogWindowClient);

        this.ipcClient.set(dialogWindowClient.createClient());

    }

    private onMessageReceived(event: any) {

        const data = event.data;

        // TODO: refactor this to use IPC and make the api have
        // /api/context-menu in it so that it's obvious that we're responding
        // to context menu events

        if (data) {

            if (data.type === 'add-flashcard') {

                const triggerEvent = TriggerEvent.create(event.data);

                log.info("Creating flashcard from trigger event: ", triggerEvent);

                this.createFlashcard(triggerEvent)
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    private async createFlashcard(triggerEvent: TriggerEvent) {

        await this.showDialog();
        await this.sendAnnotationDescriptor(triggerEvent);

    }

    private async sendAnnotationDescriptor(triggerEvent: TriggerEvent) {

        log.info("Sending annotation descriptor...");

        const annotationDescriptors
            = AnnotationTriggerEvents.getAnnotationDescriptors(triggerEvent);

        if (annotationDescriptors.length === 0) {
            log.warn("No annotation descriptors.");
            return;
        }

        const annotationDescriptor = annotationDescriptors[0];

        await this.ipcClient.get().execute('/create-flashcard/api/create', annotationDescriptor);

        log.info("Flashcard created!");

        await this.hideDialog();

        Toaster.success("New flashcard created.");

    }

    private async showDialog() {
        log.info("Showing dialog...");
        await this.flashcardDialogWindow.get().show();
        log.info("Showing dialog...done");
    }

    private async hideDialog() {
        log.info("Hiding dialog...");
        await this.flashcardDialogWindow.get().hide();
        log.info("Hiding dialog...done");
    }

    private async createDialogWindow(): Promise<DialogWindowClient> {

        let appPath = "./apps/card-creator/index.html";

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource, 700, 900);
        options.show = false;

        return await DialogWindowClient.create(options);

    }

}
