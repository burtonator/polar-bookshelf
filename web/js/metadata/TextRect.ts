import {ITextRect} from "polar-shared/src/metadata/ITextRect";
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {SerializedObject} from "./SerializedObject";

export class TextRect extends SerializedObject implements ITextRect {

    public readonly text: string;

    public readonly rect: IRect;

    constructor(val: any) {

        super(val);

        this.text = val.text;
        this.rect = val.rect || null;

        this.init(val);

    }

}

