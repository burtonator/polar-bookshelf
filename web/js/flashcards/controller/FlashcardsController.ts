import {Logger} from "polar-shared/src/logger/Logger";
import {Model} from '../../model/Model';
import {IPCEngines} from '../../ipc/handler/IPCEngines';
import {CreateAnnotationHandler} from './handlers/CreateAnnotationHandler';

const log = Logger.create();

/**
 * Runs in our main process and fires when a flashcard has been created and
 * needs to be stored in the model.
 *
 * @ElectronRendererContext
 */
export class FlashcardsController {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public start() {

        let ipcEngine = IPCEngines.rendererProcess();

        ipcEngine.registry.registerPath('/api/annotations/create-annotation', new CreateAnnotationHandler(this.model));

        ipcEngine.start();

    }

}
