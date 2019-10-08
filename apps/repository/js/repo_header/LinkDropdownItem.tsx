import * as React from 'react';
import {TrackedDropdownLink} from './TrackedDropdownLink';

/**
 */
export class LinkDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <TrackedDropdownLink trackingCategory='links-dropdown-click'
                                 id={this.props.id}
                                 link={this.props.link}
                                 title={this.props.title}
                                 hidden={this.props.hidden}
                                 tooltip={this.props.tooltip}
                                 icon={this.props.icon}/>
        );

    }

}

export interface IProps {

    readonly id: string;
    readonly title: string;
    readonly tooltip: string;
    readonly icon: string;
    readonly hidden?: boolean;

    readonly link: string;

}

interface IState {

}
