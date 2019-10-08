import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {TagPaths} from './TagPaths';
import {Tags} from './Tags';
import {Tag} from './Tags';

export interface MutableTagNode<V> {

    id: string;

    name: string;

    path: string;

    children: Array<MutableTagNode<V>>;

    value: V;

    count: number;

}

export interface TagNode<V> {

    readonly id: string;

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<TagNode<V>>;

    readonly count: number;

    readonly value: V;

}

/**
 * A tag but also the data about the number of records that match this tag.
 */
export interface TagDescriptor extends Tag {
    readonly count: number;
}

export class TagNodes {

    /**
     * Create a hierarchical structure of tags from the tag descriptors.
     */
    public static create(...tags: ReadonlyArray<TagDescriptor>): TagNode<TagDescriptor> {

        const tagIndex: {[label: string]: TagDescriptor} = {};

        for (const tag of tags) {

            if (! tag.label.startsWith("/")) {
                continue;
            }

            tagIndex[tag.label] = tag;

        }

        const tagNodeIndex = new TagNodeIndex();

        // the global count for all nodes
        const count =
            tags.filter(current => current.label !== '/')
                .map(current => current.count)
                .reduce(Reducers.SUM, 0);

        // always register a root so we have at least one path
        const root = tagNodeIndex.register('/', '/', {id: '/', label: '/', count});

        const sortedTagIndexKeys = Object.keys(tagIndex).sort();

        for (const tagLabel of sortedTagIndexKeys) {

            const tag = tagIndex[tagLabel];

            const pathEntries = TagPaths.createPathEntries(tagLabel);

            for (const pathEntry of pathEntries) {

                if (pathEntry.parent) {

                    const parent = tagNodeIndex.get(pathEntry.parent.path);

                    if (! tagNodeIndex.contains(pathEntry.path)) {

                        const computeVirtualTagFromPathEntry = (): TagDescriptor => {

                            if (tagIndex[pathEntry.path]) {
                                // done as we already have a tag for this.
                                return tagIndex[pathEntry.path];
                            }

                            const virtualTag = Tags.create(pathEntry.path);

                            return {...virtualTag, count: 0};

                        };

                        const virtualTag = computeVirtualTagFromPathEntry();

                        const newNode = tagNodeIndex.register(pathEntry.path, pathEntry.basename, virtualTag);
                        parent.children.push(newNode);
                    }

                }

            }

        }

        return root;

    }

}


class TagNodeIndex {

    private index: {[path: string]: MutableTagNode<TagDescriptor>} = {};

    public register(path: string,
                    name: string,
                    value: TagDescriptor): MutableTagNode<TagDescriptor> {

        if (! this.index[path]) {

            this.index[path] = {
                id: value.id,
                name,
                path,
                children: [],
                count: value.count,
                value
            };

        }

        return this.index[path];

    }

    public contains(path: string): boolean {
        return isPresent(this.index[path]);
    }

    public get(path: string) {
        return this.index[path];
    }

}
