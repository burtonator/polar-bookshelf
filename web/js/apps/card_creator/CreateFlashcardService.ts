import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {CreateFlashcardHandler} from './handlers/CreateFlashcardHandler';
import {ElectronRendererPipe} from '../../ipc/pipes/ElectronRendererPipe';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class CreateFlashcardService {

    private readonly createFlashcardForm: CreateFlashcardForm;

    constructor(createFlashcardForm: CreateFlashcardForm) {
        this.createFlashcardForm = createFlashcardForm;
    }

    async start(): Promise<void> {

        log.info("Starting...");

        let pipe = new ElectronRendererPipe();
        let ipcPipe = new ElectronIPCPipe(pipe);

        let ipcRegistry = new IPCRegistry();

        ipcRegistry.registerPath('/create-flashcard/api/create', new CreateFlashcardHandler(this.createFlashcardForm));

        let ipcEngine = new IPCEngine(ipcPipe, ipcRegistry);

        ipcEngine.start();

        log.info("Starting...done");

    }

}
