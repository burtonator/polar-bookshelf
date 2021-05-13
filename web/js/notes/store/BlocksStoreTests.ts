import { ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockIDStr, IBlockContent} from "./BlocksStore";
import {IBlock, IBlockLink} from "./IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {PositionalArrays} from "./PositionalArrays";

export namespace BlocksStoreTests {

    import PositionalArray = PositionalArrays.PositionalArray;

    export interface IBasicBlockOpts<C> {
        readonly id?: BlockIDStr;
        readonly root: BlockIDStr;
        readonly parent: BlockIDStr | undefined;
        readonly parents: ReadonlyArray<BlockIDStr>
        readonly content: C;
        readonly items?: PositionalArray<BlockIDStr>;
        readonly links?: PositionalArray<IBlockLink>;
        readonly mutation?: number;
    }

    export function createBasicBlock<C extends IBlockContent = IBlockContent>(opts: IBasicBlockOpts<C>): IBlock<C> {

        const nspace = '234'
        const uid = '1234'
        const created = ISODateTimeStrings.create();

        return {
            id: opts.id || Hashcodes.createRandomID(),
            nspace,
            uid,
            created,
            updated: created,
            ...opts,
            root: opts.root,
            parent: opts.parent || undefined,
            parents: opts.parents,
            items: opts.items || {},
            links: opts.links || {},
            mutation: opts.mutation || 0
        }

    }
}
