import {AnnotationInfo} from './AnnotationInfo';

export class AnnotationInfos {

    public static create() {

        const result: AnnotationInfo = Object.create(AnnotationInfo.prototype);
        result.init(result);

        return result;

    }


}
