/**
 * Represents a reference to an annotation which includes all the information
 * we need to work with the annotation.
 */
import {Preconditions} from 'polar-shared/src/Preconditions';

export class AnnotationPointer {

    /**
     * The ID for the annotation.
     */
    public readonly id: string;

    /**
     * The page number on which the annotation is placed.
     */
    public readonly pageNum: number;

    constructor(id: string, pageNum: number) {
        this.id = id;
        this.pageNum = pageNum;

        Preconditions.assertNotNull(this.id, "id");
        Preconditions.assertNotNull(this.pageNum, "pageNum");

    }

}
