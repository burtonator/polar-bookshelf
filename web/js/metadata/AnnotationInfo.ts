import {SerializedObject} from './SerializedObject';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {IAnnotationInfo} from "polar-shared/src/metadata/IAnnotationInfo";

/**
 * High level information about the annotations in this document.
 *
 */
export class AnnotationInfo extends SerializedObject implements IAnnotationInfo {

    /**
     * The last time this document was annotated (pagemarks updated, text
     * updated, etc).
     */
    public lastAnnotated?: ISODateTimeString;

    constructor(val: AnnotationInfo) {

        super(val);

        this.lastAnnotated = val.lastAnnotated;

        this.init(val);

    }

    public validate() {
        super.validate();
    }

}

