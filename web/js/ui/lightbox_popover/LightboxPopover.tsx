/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {Blackout} from '../blackout/Blackout';

/**
 * Popover that functions like a normal popover but uses a lightbox to highlight
 * the popover being selected.
 */
export class LightboxPopover extends React.Component<IProps, IState> {

    private value: string = '';

    constructor(props: IProps) {
        super(props);

    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {

        if (this.props.open !== nextProps.open) {
            Blackout.toggle(nextProps.open);
        }
    }

    public render() {

        return (

            <Popover placement={this.props.placement || 'bottom'}
                     isOpen={this.props.open}
                     className={this.props.className}
                     target={this.props.target}
                     trigger="legacy"
                     style={this.props.style}>

                {this.props.children}

            </Popover>

        );
    }

}

interface IProps {
    target: string;
    open: boolean;
    placement?: Popper.Placement;
    className?: string;
    style?: React.CSSProperties;
}

interface IState {

}

