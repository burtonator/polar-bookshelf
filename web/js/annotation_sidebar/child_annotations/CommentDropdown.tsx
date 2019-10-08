import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Tooltip} from 'reactstrap';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../react/IStyleMap';
import {DocAnnotation} from '../DocAnnotation';
import {ConfirmPopover} from '../../ui/confirm/ConfirmPopover';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class CommentDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onDeleteSelected = this.onDeleteSelected.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected,
        };

    }

    public render() {

        const toggleID = this.props.id + '-dropdown-toggle';

        return (

            <div className="text-right">

                <Dropdown id={this.props.id}
                          isOpen={this.state.open}
                          toggle={this.toggle}>

                    <DropdownToggle color="light"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    disabled={this.props.disabled}
                                    id={toggleID}>

                        <i className="fas fa-ellipsis-h"></i>

                    </DropdownToggle>

                    <DropdownMenu right>

                        <DropdownItem className="text-danger" onClick={() => this.onDeleteSelected()}>
                            Delete
                        </DropdownItem>

                    </DropdownMenu>


                </Dropdown>

                <ConfirmPopover open={this.state.selected === 'delete'}
                                target={toggleID}
                                title="Are you sure you want to delete this comment? "
                                onCancel={() => this.select('none')}
                                onConfirm={() => this.onDelete()}/>

            </div>

        );

    }

    private onDeleteSelected() {
        this.select('delete');
    }

    private onDelete() {
        this.props.onDelete(this.props.comment);
        this.select('none');
    }

    private toggle() {

        this.open = ! this.state.open;

        this.refresh();

    }

    private select(selected: SelectedOption) {
        this.selected = selected;
        this.refresh();
    }

    private refresh() {

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

}

interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly onDelete: (comment: DocAnnotation) => void;
    readonly disabled?: boolean;
}

interface IState {

    open: boolean;
    selected: SelectedOption;

}

type SelectedOption = 'delete' | 'none';

