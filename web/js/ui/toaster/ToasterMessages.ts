/**
 *
 */
import {ToasterMessage} from './ToasterMessage';
import {Broadcasters} from '../../ipc/Broadcasters';

export class ToasterMessages {

    public static CHANNEL: string = '/toaster-message';

    public static send(message: ToasterMessage) {
        Broadcasters.send(this.CHANNEL, message);
    }

}
