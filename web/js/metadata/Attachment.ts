import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IAttachment} from "polar-shared/src/metadata/IAttachment";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export class Attachment extends SerializedObject implements IAttachment {

    public readonly fileRef: BackendFileRef;

    public constructor(opts: any) {

        super(opts);

        this.fileRef = opts.fileRef;

        this.init(opts);

    }


    public validate() {

        super.validate();

        Preconditions.assertPresent(this.fileRef, "data");

    }

}

