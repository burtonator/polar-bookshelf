/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';

export class TextInputButton extends React.Component<IProps, IState> {

    private value: string = '';

    constructor(props: IProps) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            popoverOpen: false
        };

    }

    public render() {
        return (
            <div>

                <Button id={this.props.id} onClick={this.toggle}>
                    {this.props.children}
                </Button>

                <Popover placement={this.props.placement || 'bottom'}
                         isOpen={this.state.popoverOpen}
                         target={this.props.id}
                         toggle={this.toggle}>

                    <PopoverBody>

                        <div className="w-100 text-center lead p-1">

                        </div>

                        <Form>

                            <FormGroup>

                                <Label className="font-weight-bold" for={this.props.id}>{this.props.title}</Label>

                                <Input type="text"
                                       name="text"
                                       id={this.props.id}
                                       onChange={(event) => this.value = event.target.value}
                                       placeholder={this.props.placement || ''}/>

                            </FormGroup>

                        </Form>

                        <div className="text-right">

                            <Button color="secondary"
                                    size="sm"
                                    className="m-1"
                                    onClick={() => this.onCancel()}>Cancel</Button>

                            <Button color="primary"
                                    size="sm"
                                    className="m-1"
                                    onClick={() => this.props.onComplete(this.value)}>Set</Button>

                        </div>

                    </PopoverBody>

                </Popover>

            </div>
        );
    }

    private hide() {
        this.setState({
            popoverOpen: false
        });
    }

    private onCancel() {
        this.hide();
    }

    private toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

}

interface IProps {
    id: string;
    title: string;
    placement?: Popper.Placement;
    placeholder?: string;
    onComplete: (value: string) => void;
}

interface IState {
    popoverOpen: boolean;
}

