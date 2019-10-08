import * as React from 'react';
import {TagDescriptor} from '../../tags/TagNode';
import {Tag} from "../../tags/Tags";

export class TagListItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div style={{display: 'flex'}}>

                <div>{this.props.tag.label}</div>

                <div className="ml-auto">
                    {this.props.tag.count}
                </div>

            </div>

        );

    }

    private onSelectedTags(selected: ReadonlyArray<Tag>) {

    }

}

interface IProps {
    readonly tag: TagDescriptor;
}

interface IState {

}
