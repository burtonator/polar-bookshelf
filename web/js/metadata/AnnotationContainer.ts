import {Annotation} from './Annotation';
import {AnnotationDescriptor} from './AnnotationDescriptor';
import {Preconditions} from 'polar-shared/src/Preconditions';

export class AnnotationContainer<A extends Annotation> {

    public readonly descriptor: AnnotationDescriptor;

    public readonly value: A;

    public constructor(template: AnnotationContainer<A>) {
        this.descriptor = Preconditions.assertNotNull(template.descriptor);
        this.value = Preconditions.assertNotNull(template.value);
    }

    public static newInstance<A extends Annotation>(descriptor: AnnotationDescriptor,
                                                    value: A): Readonly<AnnotationContainer<A>> {

        const result = new AnnotationContainer(<AnnotationContainer<A>> {
            descriptor, value
        });

        return Object.freeze(result);

    }

}
