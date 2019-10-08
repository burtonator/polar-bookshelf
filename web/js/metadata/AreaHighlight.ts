import {BaseHighlight} from './BaseHighlight';
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";

export class AreaHighlight extends BaseHighlight implements IAreaHighlight {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

