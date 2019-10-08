import * as React from 'react';
import Select from 'react-select';
import {TagOptions} from '../../../../apps/repository/js/TagOptions';
import {Tag} from '../../tags/Tags';
import {ActionMeta, ValueType} from 'react-select/lib/types';
import {TagOption} from '../../../../apps/repository/js/TagOption';

export class TagFilter extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false,
        };

    }

    public render() {

        const options = TagOptions.fromTags(this.props.tags);

        return (

            <Select
                escapeClearsValue
                isMulti
                isClearable
                // onKeyDown={event => this.onKeyDown(event)}
                classNamePrefix="select"
                onChange={(value: ValueType<TagOption>, action: ActionMeta) => this.handleChange(value, action) }
                // defaultValue={this.state.defaultValue}
                placeholder="Filter by tag ..."
                options={options}
            />

        );

    }
    private handleChange(selectedOptions: ValueType<TagOption>, action: ActionMeta) {

        // as so as we handle the change we toggle off

        const tagValues = selectedOptions as TagOption[];

        const tags = TagOptions.toTags(tagValues);
        this.props.onChange(tags);

    }

}

interface IProps {

    readonly tags: ReadonlyArray<Tag>;
    readonly onChange: (tags: ReadonlyArray<Tag>) => void;

}

interface IState {
    readonly open: boolean;
}

