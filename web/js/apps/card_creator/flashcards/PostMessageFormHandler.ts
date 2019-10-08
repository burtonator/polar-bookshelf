import {SchemaFormFlashcardConverter} from './SchemaFormFlashcardConverter';
import {FormHandler} from '../elements/schemaform/FormHandler';
import {AnnotationContainer} from '../../../metadata/AnnotationContainer';
import {AnnotationDescriptor} from '../../../metadata/AnnotationDescriptor';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';
import {ElectronContext} from '../../../ipc/handler/ElectronContext';
import {IPCClient} from '../../../ipc/handler/IPCClient';
import {IPCClients} from '../../../ipc/handler/IPCClients';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {Completion} from '../../../util/Promises';

const log = Logger.create();

/**
 * @Deprecated
 */
export class PostMessageFormHandler extends FormHandler {

    private readonly annotationDescriptor: AnnotationDescriptor;

    private readonly targetContext: ElectronContext;

    private readonly client: IPCClient<IPCEvent>;
    private completion: Completion<boolean>;

    constructor(annotationDescriptor: AnnotationDescriptor, targetContext: ElectronContext, completion: Completion<boolean>) {
        super();
        this.annotationDescriptor = annotationDescriptor;
        this.targetContext = targetContext;
        this.completion = completion;
        this.client = IPCClients.rendererProcess();
    }

    onChange(data: any) {
        log.info("onChange: ", data);
        return true;
    }

    /**
     *
     * @param schemaFormData
     */
    onSubmit(schemaFormData: SchemaFormData) {

        log.info("onSubmit: ", schemaFormData);

        const archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

        const ref = 'none';

        const flashcard = SchemaFormFlashcardConverter.convert(schemaFormData, archetype, ref);

        const annotationDescriptor
            = AnnotationDescriptor.newInstance(AnnotationType.FLASHCARD,
                                               flashcard.id,
                                               this.annotationDescriptor.docFingerprint,
                                               this.annotationDescriptor.pageNum);

        const annotationContainer = AnnotationContainer.newInstance(annotationDescriptor, flashcard);

        (async () => {

            await this.client.execute('/api/annotations/create-annotation', annotationContainer, this.targetContext)

            // TODO: clear the schema form

            this.completion.resolve(true);

        })().catch(err => log.error("Could not handle form", err));

        return true;

    }

    onError(data: any) {

        log.info("onError: ", data);

        return true;

    }

}

