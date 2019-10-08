import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {IDimensions} from "../util/IDimensions";

export class PageInfo extends SerializedObject implements IPageInfo {

    public readonly num: number;

    public dimensions?: IDimensions;

    constructor(val: any) {

        super(val);

        this.num = val.num;

        this.init(val);

    }

    public validate() {
        Preconditions.assertNumber(this.num, "num");
    }

}

