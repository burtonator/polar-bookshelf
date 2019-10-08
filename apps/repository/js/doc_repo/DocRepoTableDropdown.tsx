import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {ListOptionType, ListSelector} from "../../../../web/js/ui/list_selector/ListSelector";
import {LightboxPopover} from '../../../../web/js/ui/lightbox_popover/LightboxPopover';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import DropdownItem from 'reactstrap/lib/DropdownItem';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

    LightboxPopover: {
        fontSize: '14px',
        // minWidth: '500px'
    }

};

export class DocRepoTableDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        // this.onDelete = this.onDelete.bind(this);
        // this.onSetTitle = this.onSetTitle.bind(this);
        // this.onCopyURL = this.onCopyURL.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected,
        };

    }

    public render() {

        const columns = this.props.options || Object.values(new DocRepoTableColumns());

        return (

            <div className="text-right">

                <Dropdown id={this.props.id}
                          isOpen={this.state.open}
                          toggle={this.toggle}>

                    <DropdownToggle color="light"
                                    size="md"
                                    className="table-dropdown-button btn text-muted p-1 m-0" id={this.props.id + '-dropdown-toggle'}>
                        <i className="fas fa-ellipsis-h"></i>
                    </DropdownToggle>

                    <DropdownMenu className="shadow" style={Styles.DropdownMenu} right>

                        <DropdownItem onClick={() => this.select('change-columns')}>
                            Change Columns
                        </DropdownItem>

                    </DropdownMenu>


                </Dropdown>

                <LightboxPopover placement={'bottom'}
                                 open={this.selected === 'change-columns'}
                                 target={this.props.id + '-dropdown-toggle'}
                                 className="p-0"
                                 style={Styles.LightboxPopover}>

                    <PopoverBody>

                        <ListSelector options={columns}
                                      id={this.props.id + 'list-options'}
                                      title="Select columns to display in the table:"
                                      onCancel={() => this.select('none')}
                                      onSet={(options) => this.onSelectedColumns(options)}
                                      onChange={(value) => console.log(value)}>

                        </ListSelector>

                    </PopoverBody>

                </LightboxPopover>

            </div>
        );

    }

    private toggle() {

        if (this.selected !== 'none') {
            this.open = false;
        } else {
            this.open = ! this.state.open;
        }

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

    // this.onSetTitle = this.onSetTitle.bind(this);

    private onSelectedColumns(options: ListOptionType[]) {

        this.select('none');

        if (this.props.onSelectedColumns) {
            this.props.onSelectedColumns(options);
        }

    }

}

interface IProps {
    id: string;
    options?: ListOptionType[];
    onSelectedColumns?: (options: ListOptionType[]) => void;
}

interface IState {

    open: boolean;
    selected: SelectedOption;

}

type SelectedOption = 'change-columns' | 'none';
