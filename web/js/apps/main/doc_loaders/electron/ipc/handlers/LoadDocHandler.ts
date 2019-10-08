import {IPCHandler} from '../../../../../../ipc/handler/IPCHandler';
import {IPCMessage} from '../../../../../../ipc/handler/IPCMessage';
import {IPCEvent} from '../../../../../../ipc/handler/IPCEvent';
import {LoadDocRequest} from '../../../../doc_loaders/LoadDocRequest';
import {Directories} from '../../../../../../datastore/Directories';
import {MainAppController} from '../../../../MainAppController';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

export class LoadDocHandler  extends IPCHandler<LoadDocRequest> {

    private readonly mainAppController: MainAppController;

    private readonly directories = new Directories();

    constructor(mainAppController: MainAppController) {
        super();
        this.mainAppController = mainAppController;
    }

    protected createValue(ipcMessage: IPCMessage<any>): LoadDocRequest {
        return ipcMessage.value;
    }

    protected async handleIPC(event: IPCEvent, loadDocRequest: LoadDocRequest): Promise<void> {

        // TODO(webapp): the LoadDocRequest should use a fingerprint and we
        // should get some form of documentURL from the datastore.
        const path = FilePaths.join(this.directories.stashDir, loadDocRequest.backendFileRef.name);

        await this.mainAppController.handleLoadDoc(path, loadDocRequest.newWindow);

    }

}
