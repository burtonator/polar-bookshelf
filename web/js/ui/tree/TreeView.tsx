import * as React from 'react';
import {TreeNode} from './TreeNode';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Tag, TagStr} from "../../tags/Tags";

export class TreeView<V> extends React.Component<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);
    }

    public render() {

        const {roots, treeState} = this.props;

        return <div>
            {roots.map(node =>
                   <TreeNode node={node}
                             title={node.title}
                             key={node.id}
                             treeState={treeState}/>)}
        </div>;

    }

}

interface IProps<V> {
    readonly roots: ReadonlyArray<TRoot<V>>;
    readonly treeState: TreeState<V>;
}

interface IState {

}


/**
 * A state object for the entire tree to keep an index of expanded/collapsed
 * nodes, etc.
 */
export class TreeState<V> {

    constructor(public readonly onSelected: (nodes: ReadonlyArray<TagStr>) => void) {
    }

    public readonly closed = new Marked();

    /**
     * The currently applied filter for the path we're searching for.
     */
    public readonly filter = "";

    /**
     * The list of the nodes that are selected by id
     */
    public readonly selected: {[id: string]: boolean} = {};

    public readonly index: {[id: string]: TreeNode<V>} = {};

    /**
     * Just the user tags that the user has selected.
     */
    public tags: ReadonlyArray<Tag> = [];

    public dispatchSelected() {

        const selectedFolders = Object.keys(this.selected);
        const selectedTags = this.tags.map(current => current.id);

        const selected = [...selectedTags, ...selectedFolders];

        this.onSelected(selected);

    }

}


export class Marked {

    public readonly data: {[id: string]: boolean} = {};

    public mark(id: string) {
        this.data[id] = true;
    }

    public isMarked(id: string): boolean {
        return isPresent(this.data[id]);
    }

    public clear(id: string) {
        delete this.data[id];
    }

    public toggle(id: string) {

        const currentValue = this.data[id];

        if (isPresent(currentValue) && currentValue) {
            this.clear(id);
        } else {
            this.data[id] = true;
        }

    }

    public reset() {
        Dictionaries.empty(this.data);
    }

}

export interface TNode<V> {

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<TNode<V>>;

    /**
     * The number of items under this node and all children.
     */
    readonly count: number;

    /**
     * The UNIQUE id for this node.
     */
    readonly id: string;

    readonly value: V;

}

/**
 * Like a node but specifically for the root
 */
export interface TRoot<V> extends TNode<V> {
    readonly title?: string;
}
