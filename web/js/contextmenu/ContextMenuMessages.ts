import {TriggerEvent} from './TriggerEvent';
import {Messenger} from '../electron/messenger/Messenger';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class ContextMenuMessages {

    public static async postContextMenuMessage(name: string, triggerEvent: TriggerEvent) {

        log.info("postContextMenuMessage: " + name);

        // TODO: this should use its own type of ContextMenuMessage with the
        // ContextMenuLocation and a type field.

        // TODO: just send the full TriggerEvent but rename it to
        // ContextMenuSelectedEvent or something along those lines.

        await Messenger.postMessage({
            message: {
                type: name,
                point: triggerEvent.point,
                points: triggerEvent.points,
                pageNum: triggerEvent.pageNum,
                matchingSelectors: triggerEvent.matchingSelectors,
                docDescriptor: triggerEvent.docDescriptor
            }
        });

    }

}
