import twitter_txt from 'twitter-text';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {IDStr} from "polar-shared/src/util/Strings";
import {Arrays} from "polar-shared/src/util/Arrays";

// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared
// DO NOT MODIFY ... migrating this to polar-shared

export class Tags {

    /**
     * Only folders (no tags).
     */
    public static onlyFolderTags(tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {
        return tags.filter(tag => tag.label.startsWith('/'));
    }

    /**
     * Only tags (no folders).
     */
    public static onlyRegular(tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {
        return tags.filter(tag => ! tag.label.startsWith('/'));
    }

    public static create(label: string): Tag {
        return {id: label, label};
    }

    /**
     * Get a basename for a label without the prefix.
     * @param label
     */
    public static basename(label: string): string {
        return Arrays.last(label.split('/'))!;
    }

    public static assertValid(label: string) {

        if (!this.validate(label).isPresent()) {
            throw new Error("Invalid tag: " + label);
        }

    }

    public static validate(label: string): Optional<string> {

        if (!isPresent(label)) {
            return Optional.empty();
        }

        if (!label.startsWith('#')) {
            label = '#' + label;
        }

        const strippedLabel = this.stripTypedLabel(label);

        if ( ! strippedLabel.isPresent()) {
            return Optional.empty();
        }

        if (twitter_txt.isValidHashtag(strippedLabel.get())) {
            return Optional.of(label);
        }

        return Optional.empty();

    }

    public static validateTag(tag: Tag): Optional<Tag> {

        if (this.validate(tag.label).isPresent()) {
            return Optional.of(tag);
        }

        return Optional.empty();

    }

    /**
     * Return true if all the tags are valid.  If no tags are given we return
     * true as the input set had no valid tags.
     */
    public static tagsAreValid(...tags: Tag[]): boolean {

        return tags.map(tag => this.validateTag(tag).isPresent())
                   .reduce((acc, curr) => ! acc ? false : curr, true);

    }

    /**
     * Return tags that are invalid.
     * @param tags
     */
    public static findInvalidTags(...tags: Tag[]): Tag[] {
        return tags.filter(tag => ! this.validateTag(tag).isPresent());
    }

    public static findValidTags(...tags: Tag[]): Tag[] {
        return tags.filter(tag => this.validateTag(tag).isPresent());
    }

    public static toMap(tags: ReadonlyArray<Tag>) {

        const result: { [id: string]: Tag } = {};

        for (const tag of tags) {
            result[tag.id] = tag;
        }

        return result;

    }

    /**
     * From a union of the two tag arrays.
     */
    public static union(a: ReadonlyArray<Tag>, b: ReadonlyArray<Tag>): ReadonlyArray<Tag> {

        const result: { [id: string]: Tag } = {};

        Dictionaries.putAll(Tags.toMap(a), result);
        Dictionaries.putAll(Tags.toMap(b), result);

        return Object.values(result);

    }

    public static toIDs(tags: ReadonlyArray<Tag>) {
        return tags.map(current => current.id);
    }

    /**
     * We support foo:bar values in tags so that we can have typed tags.
     * For example: type:book or deck:fun or something along those lines.
     *
     * We also support / to denote hierarchy, like deck:main/sub
     */
    public static stripTypedLabel(label: string): Optional<string> {

        const match = label.match(/:/g);

        if (match && match.length > 1) {
            return Optional.empty();
        }

        // Remove any single lonely slashes
        const noslashes = label.replace(/([^\/])\/([^\/])/g, '$1$2');

        // If there are any slashes left, we don't like it.
        if (noslashes.match(/\//g)) {
            return Optional.empty();
        }

        return Optional.of(noslashes.replace(/^#([^:/]+):([^:]+)$/g, '#$1$2'));
    }

    public static parseTypedTag(value: string): Optional<TypedTag> {

        value = value.replace("#", "");
        const split = value.split(":");

        return Optional.of({
            name: split[0],
            value: split[1]
        });
    }

    /**
     * Find any records in the given array with the given tags.
     */
    public static computeRecordsTagged<R extends TaggedRecord>(records: ReadonlyArray<R>,
                                                               tags: ReadonlyArray<TagStr>): ReadonlyArray<R> {

        const index: {[id: string]: R} = {};

        for (const record of records) {

            if (SetArrays.intersects(record.tags || [], tags)) {
                index[record.id] = record;
            }

        }

        return Object.values(index);

    }

}

export interface Tag {

    /**
     * The actual id for the tag which is unique across all tags.
     */
    readonly id: string;

    /**
     * The label to show in the UI.
     */
    readonly label: string;

    /**
     * True when the tag is hidden.  Used for special types of tags that should
     * not be shown in the UI as they would just clutter the UI.
     */
    readonly hidden?: boolean;

}

/**
 * A tag like deck:foo
 */
export interface TypedTag {

    /**
     */
    readonly name: string;

    /**
     */
    readonly value: string;

}

/**
 * An object that contains tags.
 */
export interface TaggedRecord {
    readonly id: IDStr;
    readonly tags?: ReadonlyArray<TagStr>;
}

/**
 * A string representation of a tag.
 */
export type TagStr = string;

/**
 * Just the tag ID, not the TagStr (which might not be unique).
 */
export type TagIDStr = string;
