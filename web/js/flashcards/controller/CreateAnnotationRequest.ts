import {DocDescriptor} from '../../metadata/DocDescriptor';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';

export class CreateAnnotationRequest {

    public readonly docDescriptor: DocDescriptor;

    public readonly annotationType: AnnotationType;

    public readonly schemaFormData: any;

    constructor(docDescriptor: DocDescriptor, annotationType: AnnotationType, schemaFormData: any) {
        this.docDescriptor = docDescriptor;
        this.annotationType = annotationType;
        this.schemaFormData = schemaFormData;
    }

}
