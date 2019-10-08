import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {
    HighlightColor,
    HighlightRects,
    IBaseHighlight,
    Position
} from "polar-shared/src/metadata/IBaseHighlight";
import {IImage} from "polar-shared/src/metadata/IImage";

export class BaseHighlight extends ExtendedAnnotation implements IBaseHighlight {

    public rects: HighlightRects = {};

    public image?: IImage;

    public images: {[key: string]: IImage} = {};

    public color?: HighlightColor;

    public position?: Position;

    constructor(val: any) {

        super(val);

    }

    public validate() {

        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);

    }

}

