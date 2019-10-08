import {ElectronIPCEvent} from '../../../ipc/handler/ElectronIPCEvent';
import {ParentWindowRegistry} from '../ParentWindowRegistry';
import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {DialogWindowReference} from '../DialogWindowReference';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {DialogWindow, DialogWindowOptions} from '../DialogWindow';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class CreateWindowHandler extends IPCHandler<DialogWindowOptions> {

    private readonly parentWindowRegistry: ParentWindowRegistry;

    constructor(parentWindowRegistry: ParentWindowRegistry) {
        super();
        this.parentWindowRegistry = parentWindowRegistry;
    }

    protected createValue(ipcMessage: IPCMessage<DialogWindowOptions>): DialogWindowOptions {
        return DialogWindowOptions.create(ipcMessage.value);
    }

    protected async handleIPC(event: ElectronIPCEvent, dialogWindowOptions: DialogWindowOptions): Promise<DialogWindowReference> {

        let dialogWindow = await DialogWindow.create(dialogWindowOptions);

        let parentWindowReference = event.senderWindowReference;

        this.parentWindowRegistry.register(dialogWindow.dialogWindowReference, parentWindowReference);

        return dialogWindow.dialogWindowReference;

    }

}

