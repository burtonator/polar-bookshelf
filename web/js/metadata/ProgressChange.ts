import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';

/**
 * Used so that we can track the history of the document as we're reading it
 * so that we can keep a burn-down chart of our reading rate.
 */
export class ProgressChange extends SerializedObject {

    public readonly id: string;

    public readonly changed: ISODateTimeString;

    /**
     * Percentage of how complete we are on the document at the given change
     * timestamp.
     */
    public readonly percentage: number;

    constructor(obj: any) {
        super(obj);

        this.id = obj.id;
        this.changed = obj.changed;
        this.percentage = obj.percentage;

    }

    public setup() {

        super.setup();

    }

    public validate() {

        super.validate();

        Preconditions.assertPresent(this.id);
        Preconditions.assertPresent(this.changed);
        Preconditions.assertPresent(this.percentage);

    }

}

