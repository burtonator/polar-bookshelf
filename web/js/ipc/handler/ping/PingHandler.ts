import {IPCHandler} from '../IPCHandler';
import {IPCMessage} from '../IPCMessage';
import {IPCEvent} from '../IPCEvent';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class PingHandler extends IPCHandler<string> {

    protected createValue(ipcMessage: IPCMessage<any>): string {
        return <string>ipcMessage.value;
    }

    protected async handleIPC(event: IPCEvent, message: string): Promise<any> {
        log.info("Got ping.  Sending response. ")
        return event.response.send('pong');
    }

}
