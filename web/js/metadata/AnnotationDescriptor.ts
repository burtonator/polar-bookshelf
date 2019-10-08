import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Preconditions} from 'polar-shared/src/Preconditions';

/**
 * High level descriptor for an annotation.  Used so that we can references
 * a specific annotation that might actually not be created yet or we just
 * want a reference without the full descriptor.
 */
export class AnnotationDescriptor {

    public readonly type: AnnotationType;
    public readonly id: string;
    public readonly docFingerprint: string;
    public readonly pageNum: number;

    public constructor(template: AnnotationDescriptor) {

        this.type = Preconditions.assertNotNull(template.type, "type");
        this.id = Preconditions.assertNotNull(template.id, "id");
        this.docFingerprint = Preconditions.assertNotNull(template.docFingerprint, "docFingerprint");
        this.pageNum = Preconditions.assertNotNull(template.pageNum, "pageNum");

    }

    public static newInstance(type: AnnotationType,
                              id: string,
                              docFingerprint: string,
                              pageNum: number): Readonly<AnnotationDescriptor> {

        const result = new AnnotationDescriptor(<AnnotationDescriptor> {
            type, id, docFingerprint, pageNum
        });

        return Object.freeze(result);

    }

}
