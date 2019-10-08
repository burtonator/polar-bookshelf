import {TagOption} from './TagOption';
import {Tag} from '../../../web/js/tags/Tags';

export class TagOptions {

    public static toTags(tagOptions: TagOption[]): Tag[] {

        return tagOptions.map((current): Tag => {

            return {
                id: current.value,
                label: current.label
            };

        });

    }

    public static fromTags(tags: ReadonlyArray<Tag>): TagOption[] {

        return tags.map( current => {
                   return {
                       value: current.id,
                       label: current.label
                   };
               })
               .sort((a, b) => a.label.localeCompare(b.label));

    }

}
