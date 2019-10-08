/**
 * Some type of follow up on content that we need to analyze.
 */
import {Note} from './Note';

export class Question extends Note {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

