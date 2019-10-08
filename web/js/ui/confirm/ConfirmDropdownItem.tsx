import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Tooltip} from 'reactstrap';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../react/IStyleMap';
import {ConfirmPopover} from '../../ui/confirm/ConfirmPopover';

const log = Logger.create();

/**
 * This component doesn't work. It would be more elegant to do this but I think it
 * stops working because the parent item is no longer open and reactstap doesn't
 * display the component.
 */
export class ConfirmDropdownItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelected = this.onSelected.bind(this);
        this.onCancelled = this.onCancelled.bind(this);
        this.onConfirmed = this.onConfirmed.bind(this);

        this.state = {
            selected: false
        };

    }

    public render() {

        return (

            <div className="">

                <DropdownItem onClick={() => this.onSelected()}>
                    {this.props.text}
                </DropdownItem>

                <ConfirmPopover open={this.state.selected}
                                target={this.props.target}
                                title={this.props.prompt}
                                onCancel={() => this.onCancelled()}
                                onConfirm={() => this.onConfirmed()}/>

            </div>

        );

    }

    private onSelected() {
        this.setState({selected: true});
    }

    private onCancelled() {
        if (this.props.onCancelled) {
            this.props.onCancelled();
        }
    }

    private onConfirmed() {

        if (this.props.onConfirmed) {
            this.props.onConfirmed();
        }

    }

}

interface IProps {

    text: string;

    target: string;

    prompt: string;

    /**
     * Called when the item has been cancelled.
     */
    onCancelled?: () => void;

    /**
     * Called when the item has been confirmed.
     */
    onConfirmed?: () => void;
}

interface IState {

    selected: boolean;

}
