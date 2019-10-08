import {IPCEngines} from '../../../../../ipc/handler/IPCEngines';
import {LoadDocHandler} from './handlers/LoadDocHandler';
import {MainAppController} from '../../../MainAppController';

export class DocLoaderService {

    private readonly mainAppController: MainAppController;

    constructor(mainAppController: MainAppController) {
        this.mainAppController = mainAppController;
    }

    public start(): void {

        const ipcEngine = IPCEngines.mainProcess();

        ipcEngine.registry.registerPath('/main/load-doc', new LoadDocHandler(this.mainAppController));

        ipcEngine.start();

    }

}
