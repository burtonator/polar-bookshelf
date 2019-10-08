/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Input, Label, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {Blackout} from '../blackout/Blackout';

export class TextInputPopover extends React.Component<IProps, IState> {

    private value: string = '';

    constructor(props: IProps) {
        super(props);

    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {

    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        if (this.props.open !== nextProps.open) {
            Blackout.toggle(nextProps.open);
        }
    }

    public componentWillUnmount(): void {
        Blackout.disable();
    }

    public render() {

        return (

            // TODO: set the min-width here via inline styles
            <Popover placement={this.props.placement || 'bottom'}
                     isOpen={this.props.open}
                     target={this.props.target}
                     className="text-input-popover">

                <PopoverBody>

                    <div className="w-100 text-center lead p-1">

                    </div>

                    <Label className="font-weight-bold" for={this.props.target + '-input'}>{this.props.title}</Label>

                    <Input type="text"
                           name="text"
                           id={this.props.target + '-input'}
                           onKeyDown={event => this.onKeyDown(event)}
                           defaultValue={this.props.defaultValue  || ''}
                           onChange={(event) => this.value = event.target.value}
                           autoFocus
                           placeholder={this.props.placement || ''}/>

                    <div className="text-right mt-1">

                        <Button color="secondary"
                                size="sm"
                                className="m-1"
                                onClick={() => this.props.onCancel()}>Cancel</Button>

                        <Button color="primary"
                                size="sm"
                                className="m-1"
                                onClick={() => this.props.onComplete(this.value)}>Set</Button>

                    </div>

                </PopoverBody>

            </Popover>


        );
    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Enter") {
            this.props.onComplete(this.value);
        }

    }

}

interface IProps {
    target: string;
    title: string;
    defaultValue?: string;
    open: boolean;
    placement?: Popper.Placement;
    placeholder?: string;
    onCancel: () => void;
    onComplete: (value: string) => void;
}

interface IState {

}

