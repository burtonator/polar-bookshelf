import {IBlockContent} from "../store/BlocksStore";

export interface IBaseBlockContent {
    update: (content: IBlockContent) => void;
    toJSON: () => any;
}
