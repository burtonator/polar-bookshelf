import {CreateFlashcardForm} from '../elements/schemaform/CreateFlashcardForm';
import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {AnnotationDescriptor} from '../../../metadata/AnnotationDescriptor';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {PostMessageFormHandler} from '../flashcards/PostMessageFormHandler';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Completion} from '../../../util/Promises';

const log = Logger.create();

export class CreateFlashcardHandler extends IPCHandler<IPCMessage<AnnotationDescriptor>> {

    private readonly createFlashcardForm: CreateFlashcardForm;

    constructor(createFlashcardForm: CreateFlashcardForm) {
        super();
        this.createFlashcardForm = createFlashcardForm;
    }

    protected createValue(ipcMessage: IPCMessage<any>): IPCMessage<AnnotationDescriptor> {
        return ipcMessage;
    }

    protected async handleIPC(event: IPCEvent, request: IPCMessage<AnnotationDescriptor>): Promise<any> {

        let context = request.context;
        let annotationDescriptor = request.value;

        return new Promise<boolean>((resolve, reject) => {

            log.info("Creating new post message for connected to annotation annotationDescriptor: ", annotationDescriptor);

            let completion: Completion<boolean> = {
                resolve,
                reject
            };

            this.createFlashcardForm.formHandler = new PostMessageFormHandler(annotationDescriptor, context, completion);

            this.createFlashcardForm.render();

        });

    }

}
