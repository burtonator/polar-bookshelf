import {makeObservable, observable, computed} from "mobx"
import {IMarkdownContent} from "./IMarkdownContent";
import {IBlockContent} from "../store/BlocksStore";
import {IBaseBlockContent} from "./IBaseBlockContent";

export class MarkdownContent implements IMarkdownContent, IBaseBlockContent {

    @observable private readonly _type: 'markdown';
    @observable private _data: string;

    constructor(opts: IMarkdownContent) {

        this._type = opts.type;
        this._data = opts.data;

        makeObservable(this)

    }

    @computed get type() {
        return this._type;
    }

    @computed get data() {
        return this._data;
    }

    public update(content: IBlockContent) {

        if (content.type === 'markdown') {
            this._data = content.data;
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IMarkdownContent {
        return {
            type: this._type,
            data: this._data
        }
    }

}

