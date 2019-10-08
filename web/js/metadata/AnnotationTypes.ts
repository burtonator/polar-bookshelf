import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';

export class AnnotationTypes {

    public static fromString(val: string) {
        return AnnotationType[val as keyof typeof AnnotationType];
    }

    public static toDataAttribute(annotationType: AnnotationType) {
        return annotationType.toLowerCase().replace("_", "-");
    }

}
