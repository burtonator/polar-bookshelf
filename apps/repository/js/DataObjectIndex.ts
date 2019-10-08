import {Tag} from '../../../web/js/tags/Tags';
import {TagDescriptor} from '../../../web/js/tags/TagNode';


/**
 * Keeps an index of our tag and the keys within this tag so that add/remove
 * is idempotent.
 */
class TagSet {

    private keys = new Set<string>();

    public constructor(public readonly tag: Tag) {

    }

    public add(key: string) {
        this.keys.add(key);
    }

    public remove(key: string) {
        this.keys.delete(key);
    }

    public count() {
        return this.keys.size;
    }

}

class TagIndex {

    private backing: {[id: string]: TagSet} = {};

    public add(key: string, tag: Tag) {

        if (! this.backing[tag.id]) {
            this.backing[tag.id] = new TagSet(tag);
        }

        this.backing[tag.id].add(key);

    }

    public remove(key: string, tag: Tag) {

        if (this.backing[tag.id]) {
            const tagSet = this.backing[tag.id];
            tagSet.remove(key);

            if (tagSet.count() === 0) {
                delete this.backing[tag.id];
            }

        }

    }

    public toTagDescriptors(): ReadonlyArray<TagDescriptor> {

        return Object.values(this.backing).map(current => {
            return {
                ...current.tag,
                count: current.count()
            };

        });
    }

}

/**
 * Stores generic data objects like RepoDocInfo or RepoAnnotation and provides
 * generic tag structure metadata too.
 */
export class DataObjectIndex<D> {

    private index: {[id: string]: D} = {};

    private tags = new TagIndex();

    public constructor(private readonly toTags: (input?: D) => ReadonlyArray<Tag>) {

    }

    public add(key: string, data: D) {
        this.index[key] = data;

        for (const tag of this.toTags(data)) {
            this.tags.add(key, tag);
        }

    }

    public remove(key: string) {
        const value = this.index[key];
        delete this.index[key];

        for (const tag of this.toTags(value)) {
            this.tags.remove(key, tag);
        }

    }

    public values(): ReadonlyArray<D> {
        return Object.values(this.index);
    }

    public size(): number {
        return Object.keys(this.index).length;
    }

    public toTagDescriptors() {
        return this.tags.toTagDescriptors();
    }

}
