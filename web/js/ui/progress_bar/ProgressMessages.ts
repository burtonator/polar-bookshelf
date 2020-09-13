import {Broadcasters} from '../../ipc/Broadcasters';
import {ProgressMessage} from './ProgressMessage';
import {Messenger} from '../../electron/messenger/Messenger';
import {TypedMessage} from '../../util/TypedMessage';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AppRuntime} from "../../AppRuntime";

const log = Logger.create();

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static broadcast(progressMessage: ProgressMessage) {

        if (AppRuntime.get() === 'electron-main') {
            // this is done so that the main process in electron can send a
            // progress message.
            Broadcasters.send(this.CHANNEL, progressMessage);
        } else {

            const message: TypedMessage<ProgressMessage> = {
                type: this.CHANNEL,
                value: progressMessage
            };

            Messenger.postMessage({message})
                .catch(err => log.error("Could not send message: ", err));

        }

    }

}
