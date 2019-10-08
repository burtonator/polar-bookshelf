
/**
 * Basic serialized object pattern. Take a closure as an argument to init,
 * and then assign the fields.  Then setup and validate that we have our
 * required data structures.
 */
export class SerializedObject {

    constructor(val?: Partial<SerializedObject>) {
        // noop
    }

    public init(val: any): void {

        if (typeof val === "object") {
            Object.assign(this, val);
            this.setup();
            this.validate();
        }

    }

    public setup() {
        // noop
    }

    public validate() {
        // noop
    }

}
