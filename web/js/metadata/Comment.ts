/**
 * Basically just like a note but it's a comment in a discussion stream.
 */
import {Note} from './Note';
import {IComment} from "polar-shared/src/metadata/IComment";

export class Comment extends Note implements IComment {

    constructor(val: any) {
        super(val);
    }

}

