import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {AnnotationContainer} from '../../../metadata/AnnotationContainer';
import {Annotation} from '../../../metadata/Annotation';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Model} from '../../../model/Model';
import {Flashcard} from '../../../metadata/Flashcard';
import {Toaster} from '../../../ui/toaster/Toaster';
import {DocMetas} from "../../../metadata/DocMetas";

const log = Logger.create();

/**
 * Called when the context menu told us to create a new flashcard.  Our job
 * is to reset the form first.
 */
export class CreateAnnotationHandler extends IPCHandler<AnnotationContainer<Annotation>> {

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    protected createValue(ipcMessage: IPCMessage<any>): AnnotationContainer<Annotation> {
        return new AnnotationContainer(ipcMessage.value);
    }

    protected async handleIPC(event: IPCEvent, annotationContainer: AnnotationContainer<Annotation>): Promise<any> {

        log.info("Got create annotation message: ", annotationContainer );

        const descriptor = annotationContainer.descriptor;

        if (descriptor.type === AnnotationType.FLASHCARD) {

            const flashcard = new Flashcard(<Flashcard> annotationContainer.value);

            if (descriptor.docFingerprint === this.model.docMeta.docInfo.fingerprint) {

                log.info("Going to add this flashcard to the model");

                const pageMeta = DocMetas.getPageMeta(this.model.docMeta, descriptor.pageNum);

                // FIXME: these need to be attached to the parent annotation not
                // stored directly on the page...

                pageMeta.flashcards[flashcard.id] = flashcard;

                // FIXME: stick this on the proper parent .. this could either
                // be a page directly or a

            } else {
                log.info(`Ignoring flashcard.  ${descriptor.docFingerprint} != ${this.model.docMeta.docInfo.fingerprint}`)
            }

        } else {
            log.info("Wrong annotation type: ", descriptor.type);
        }

        return undefined;

    }

}
