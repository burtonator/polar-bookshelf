import {Tag} from '../../../web/js/tags/Tags';

/**
 * The list of tags that the user has filtered.
 */
export class FilteredTags {

    private tags: Tag[] = [];

    public get(): ReadonlyArray<Tag> {
        return this.tags;
    }

    public set(tags: Tag[]) {
        this.tags = tags;
    }

}

