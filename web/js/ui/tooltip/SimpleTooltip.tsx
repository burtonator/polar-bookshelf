/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UncontrolledTooltip} from 'reactstrap';

export class SimpleTooltip extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const placement = this.props.placement || 'bottom';

        const show = this.props.show !== undefined ? this.props.show : 500;

        return (

            <UncontrolledTooltip style={{
                                     maxWidth: '325px',
                                     textAlign: 'justify',
                                     ...this.props.style || {}
                                 }}
                                 placement={placement}
                                 delay={{show, hide: 0}}
                                 target={this.props.target}>

                {this.props.children}

            </UncontrolledTooltip>

        );
    }

}

interface IProps {
    readonly target: string;
    readonly placement?: 'bottom' | 'top' | 'right' | 'left';
    readonly show?: number;
    readonly style?: React.CSSProperties;
}

interface IState {
}

