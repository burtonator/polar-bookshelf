
let seq: number = 0;

export interface ObjectID {

    /**
     * A unique object ID for this document which can be used to quickly compare
     * objects.
     */
    readonly oid: number;

}

export class ObjectIDs {

    public static create(): number {
        return seq++;
    }

    public static equals(a: ObjectID, b: ObjectID) {
        return a.oid === b.oid;
    }

}
