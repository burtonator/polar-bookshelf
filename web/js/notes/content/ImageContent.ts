import {makeObservable, observable, computed} from "mobx"
import {DataURLStr, IImageContent} from "./IImageContent";
import {IBaseBlockContent} from "./IBaseBlockContent";
import {IBlockContent} from "../store/BlocksStore";

export class ImageContent implements IImageContent, IBaseBlockContent {

    @observable private readonly _type: 'image';
    @observable private _src: DataURLStr;

    @observable private _width: number;
    @observable private _height: number;

    @observable private _naturalWidth: number;
    @observable private _naturalHeight: number;


    constructor(opts: IImageContent) {

        this._type = opts.type;
        this._src = opts.src;
        this._width = opts.width;
        this._height = opts.height;
        this._naturalWidth = opts.naturalWidth;
        this._naturalHeight = opts.naturalHeight;

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get src() {
        return this._src;
    }

    @computed get width() {
        return this._width;
    }

    @computed get height() {
        return this._height;
    }

    @computed get naturalWidth() {
        return this._naturalWidth;
    }

    @computed get naturalHeight() {
        return this._naturalHeight;
    }

    public update(content: IBlockContent) {
        if (content.type === 'image') {
            this._src = content.src;
            this._width = content.width;
            this._height = content.height;
            this._naturalHeight = content.naturalHeight;
            this._naturalWidth = content.naturalWidth;
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IImageContent {

        return {
            type: this._type,
            src: this._src,
            width: this._width,
            height: this._height,
            naturalWidth: this._naturalWidth,
            naturalHeight: this._naturalHeight,
        };

    }


}

