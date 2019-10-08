import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Model} from '../model/Model';
import {Toaster} from '../ui/toaster/Toaster';
import {DialogWindowClient} from '../ui/dialog_window/DialogWindowClient';
import {DialogWindowOptions, Resource, ResourceType} from '../ui/dialog_window/DialogWindow';
import {DocInfos} from '../metadata/DocInfos';
import {Strings} from "polar-shared/src/util/Strings";

const log = Logger.create();

/**
 * @Deprecated migrating to DocRepoAnkiSyncController
 */
export class AnkiSyncController {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        const triggerEvent = event.data;

        switch (event.data.type) {

            case "start-sync":
                this.onStartSync(triggerEvent)
                    .catch(err => log.error("Failed to start sync: ", err));

                break;

        }

    }

    private async onStartSync(triggerEvent: TriggerEvent) {

        log.info("Starting sync...");

        // TODO: verify that the document has a title.

        const title = DocInfos.bestTitle(this.model.docMeta.docInfo);

        if (Strings.empty(title)) {
            Toaster.error("Documents must have titles before we can synchronize.");
            return;
        }

        const resource = new Resource(ResourceType.APP, "./apps/sync/index.html?fingerprint=" + this.model.docMeta.docInfo.fingerprint);

        const dialogWindowClient = await DialogWindowClient.create(new DialogWindowOptions(resource));
        await dialogWindowClient.show();

    }

}
