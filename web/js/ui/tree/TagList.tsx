import * as React from 'react';
import {TagDescriptor} from '../../tags/TagNode';
import {TagListItem} from './TagListItem';

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    };

}

export class TagList extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            filter: "",
        };

    }

    public render() {

        const tags = [...this.props.tags]
            .sort((a, b) => a.count - b.count)
            .reverse();

        return (

            <div style={Styles.PARENT}>

                {tags.map(tag =>
                      <TagListItem key={tag.id} tag={tag}/>)}

            </div>

        );

    }

}

interface IProps {
    readonly tags: ReadonlyArray<TagDescriptor>;
}

interface IState {

}
