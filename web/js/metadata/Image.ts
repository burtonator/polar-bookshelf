import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IImage, ImageType} from "polar-shared/src/metadata/IImage";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export class Image extends SerializedObject implements IImage {

    public readonly id: string;

    public readonly type: ImageType;

    public readonly src: BackendFileRef;

    public readonly width?: number;

    public readonly height?: number;

    public readonly rel?: string;

    constructor(opts: IImage) {

        super(<any> opts);

        this.id = opts.id;
        this.type = opts.type;
        this.src = opts.src;
        this.width = opts.width;
        this.height = opts.height;
        this.rel = opts.rel;

        this.init(opts);

    }


    public validate(): void {

        super.validate();

        Preconditions.assertPresent(this.type, "type");
        Preconditions.assertPresent(this.src, "src");

    }

}

export interface ImageOpts {
    readonly width?: number;
    readonly height?: number;
    readonly rel?: string;
    readonly type?: ImageType;
}

export enum ImageTypes {
    GIF = 'image/gif',
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    WEBP = 'image/webp',
    SVG = 'image/svg+xml'
}

