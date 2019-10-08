import {WebContents} from 'electron';
import {IPCEvent} from './IPCEvent';
import {WritablePipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';
import {Preconditions} from 'polar-shared/src/Preconditions';

export class ElectronIPCEvent extends IPCEvent {

    // TODO: just refactor this into the main IPC Event and have it be a context
    // so we don't need the Electron IPC Event system..
    public readonly senderWindowReference: BrowserWindowReference;

    constructor(responsePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>, sender: WebContents) {
        super(responsePipe, message, sender);

        Preconditions.assertNotNull(sender, "sender");

        // let browserWindow = BrowserWindow.fromWebContents(sender);
        this.senderWindowReference = new BrowserWindowReference(sender.id);

    }

}
