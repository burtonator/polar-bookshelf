import {IBlock, IBlockLink, NamespaceIDStr, TMutation, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import PositionalArrayPositionStr = PositionalArrays.PositionalArrayPositionStr;
import deepEqual from "deep-equal";
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import IItemsPositionPatch = BlocksStoreMutations.IItemsPositionPatch;
import {Preconditions} from "polar-shared/src/Preconditions";

/**
 * Opts for withMutation normally used for undo.
 */
export interface IWithMutationOpts {
    readonly updated: ISODateTimeString;
    readonly mutation: TMutation;
}

export class Block<C extends BlockContent = BlockContent> implements IBlock<C> {

    @observable private _id: BlockIDStr;

    /**
     * The graph to which this page belongs.
     */
    @observable private _nspace: NamespaceIDStr | UIDStr;

    /**
     * The owner of this block.
     */
    @observable readonly _uid: UIDStr;

    @observable readonly _root: UIDStr;

    @observable private _parent: BlockIDStr | undefined;

    @observable private _parents: ReadonlyArray<BlockIDStr>;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items: PositionalArray<BlockIDStr>;

    @observable private _content: C;

    /**
     * The linked wiki references to other blocks.
     */
    @observable private _links: PositionalArray<IBlockLink>;

    @observable private _mutation: TMutation;

    constructor(opts: IBlock<C | IBlockContent>) {

        Object.values(opts.items).map(current => Preconditions.assertString(current, 'current'));

        this._id = opts.id;
        this._nspace = opts.nspace;
        this._uid = opts.uid;
        this._root = opts.root;
        this._parent = opts.parent;
        this._parents = opts.parents;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = {...opts.items};
        this._content = Contents.create(opts.content);
        this._links = {...opts.links};
        this._mutation = opts.mutation;

        makeObservable(this)

    }

    @computed get id() {
        return this._id;
    }

    @computed get nspace() {
        return this._nspace;
    }

    @computed get uid() {
        return this._uid;
    }

    @computed get root() {
        return this._root;
    }

    @computed get parent() {
        return this._parent;
    }

    @computed get parents() {
        return this._parents;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items(): PositionalArray<BlockIDStr> {
        return this._items;
    }

    @computed get itemsAsArray(): ReadonlyArray<BlockIDStr> {
        return PositionalArrays.toArray(this._items);
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): PositionalArray<IBlockLink> {
        return this._links;
    }

    @computed get linksAsArray(): ReadonlyArray<IBlockLink> {
        return PositionalArrays.toArray(this._links);
    }

    @computed get mutation() {
        return this._mutation;
    }

    /**
     * Return true if the given content has been mutated vs the current content.
     */
    public hasContentMutated(content: C | IBlockContent): boolean {
        return ! deepEqual(this._content, content);
    }

    @action setContent(content: C | IBlockContent) {

        if (this._content.type !== content.type) {
            throw new Error(`Can not change content types from ${this._content.type} to ${content.type}`);
        }

        if (this.hasContentMutated(content)) {
            this._content.update(content);
            return true;
        }

        return false;

    }

    @action setParent(id: BlockIDStr | undefined): boolean {

        if (this._parent !== id) {
            this._parent = id;
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    /**
     * Return true if the given content has been mutated vs the current content.
     */
    public hasParentsMutated(parents: ReadonlyArray<BlockIDStr>): boolean {
        return ! deepEqual(this._parents, parents);
    }

    @action setParents(parents: ReadonlyArray<BlockIDStr>): boolean {

        if (this.hasParentsMutated(parents)) {
            this._parents = [...parents];
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    public hasItemsMutated(items: ReadonlyArray<BlockIDStr>): boolean {
        return ! deepEqual(PositionalArrays.toArray(this._items), items);

    }

    @action setItems(items: ReadonlyArray<BlockIDStr>): boolean {

        items.map(current => Preconditions.assertString(current, 'current'));

        if (this.hasItemsMutated(items)) {
            PositionalArrays.set(this._items, [...items]);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    @action public setItemsUsingPatches(itemPositionPatches: ReadonlyArray<IItemsPositionPatch>): boolean {

        let mutated: boolean = false;

        for(const itemPositionPatch of itemPositionPatches) {

            switch (itemPositionPatch.type) {

                case "insert":

                    if (! this.hasItem(itemPositionPatch.id)) {

                        if (this.doPutItem(itemPositionPatch.key, itemPositionPatch.id)) {
                            mutated = true;
                        }

                    }

                    break;

                case "remove":

                    if (this.hasItem(itemPositionPatch.id)) {
                        if (this.doRemoveItem(itemPositionPatch.id)) {
                            mutated = true;
                        }
                    }

                    break;

            }

        }

        return mutated;

    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'unshift'): boolean {

        Preconditions.assertString(id, 'id');

        try {

            if (!this.hasItem(id)) {

                if (pos === 'unshift') {
                    PositionalArrays.unshift(this._items, id);
                } else if (pos) {
                    PositionalArrays.insert(this._items, pos.ref, id, pos.pos);
                } else {
                    PositionalArrays.append(this._items, id);
                }

                this._updated = ISODateTimeStrings.create();

                return true;

            }

            return false;
        } catch (e) {
            throw new Error(`addItem failed on in block: ${this.id}: ` + e.message)
        }

    }

    @action private doRemoveItem(id: BlockIDStr): boolean {

        Preconditions.assertString(id, 'id');

        if (this.hasItem(id)) {

            PositionalArrays.remove(this._items, id);
            return true;

        }

        return false;

    }

    @action removeItem(id: BlockIDStr): boolean {
        Preconditions.assertString(id, 'id');

        if (this.doRemoveItem(id)) {

            this._updated = ISODateTimeStrings.create();
            return true;

        }

        return false;

    }

    @action private doPutItem(key: PositionalArrayPositionStr, id: BlockIDStr): boolean {

        Preconditions.assertString(id, 'id');

        if (! this.hasItem(id)) {

            PositionalArrays.put(this._items, key, id);

            return true;

        }

        return false;

    }

    @action putItem(key: PositionalArrayPositionStr, id: BlockIDStr): boolean {

        Preconditions.assertString(id, 'id');

        if (this.doPutItem(key, id)) {

            this._updated = ISODateTimeStrings.create();

            return true;

        }

        return false;

    }

    public hasItem(id: BlockIDStr): boolean {
        Preconditions.assertString(id, 'id');

        return PositionalArrays.toArray(this._items).includes(id);
    }

    public hasLinksMutated(links: ReadonlyArray<IBlockLink>): boolean {
        return ! deepEqual(PositionalArrays.toArray(this._links), links);

    }

    @action setLinks(links: ReadonlyArray<IBlockLink>) {

        if (this.hasLinksMutated(links)) {
            PositionalArrays.set(this._links, links);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    @action addLink(link: IBlockLink) {

        if (! this.hasLink(link.id)) {
            PositionalArrays.append(this._links, link);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    public hasLink(id: BlockIDStr): boolean {

        return arrayStream(PositionalArrays.toArray(this._links)).
                filter(current => current.id === id)
                .first() !== undefined;

    }

    @action removeLink(id: BlockIDStr): boolean {

        const link =
            arrayStream(Object.values(this._links))
                .filter(current => current.id === id)
                .first();

        if (link) {
            PositionalArrays.remove(this._links, link);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    @action set(block: IBlock) {

        this._parent = block.parent;
        this._created = block.created;
        this._updated = block.updated;
        PositionalArrays.set(this._items, block.items);
        this._content.update(block.content)
        PositionalArrays.set(this._links, block.links);

    }

    /**
     * Perform a bulk/single mutation of the Block.
     */
    public withMutation(delegate: () => void, opts?: IWithMutationOpts): boolean {

        const before = this.toJSON();

        delegate();

        const after = this.toJSON();

        let result: boolean = false;

        if (! deepEqual(before, after)) {

            this._updated = opts?.updated || ISODateTimeStrings.create();
            this._mutation = opts?.mutation || (this._mutation + 1);
            result = true;
        }

        if (opts) {

            if (this._mutation !== opts.mutation) {

                this._mutation = opts.mutation;
                result = true;

            }

            if (this._updated !== opts.updated) {

                this._updated = opts.updated;
                result = true;

            }

        }

        return result;

    }

    public toJSON(): IBlock<C> {

        return {
            id: this._id,
            nspace: this._nspace,
            uid: this._uid,
            root: this._root,
            parent: this._parent,
            parents: [...this._parents],
            created: this._created,
            updated: this._updated,
            items: {...this._items},
            content: this._content.toJSON() as any,
            links: {...this._links},
            mutation: this._mutation
        };

    }

}
