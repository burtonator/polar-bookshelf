import * as React from 'react';
import {TagsDB} from './TagsDB';
import Select from 'react-select';
import {Blackout} from '../../../web/js/ui/blackout/Blackout';
import {TagOptions} from './TagOptions';
import {TagOption} from './TagOption';
import {FilteredTags} from './FilteredTags';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {SimpleTooltipEx} from '../../../web/js/ui/tooltip/SimpleTooltipEx';
import Popper from 'popper.js';
// import {SyntheticKeyboardEvent} from 'react-dom';

const Styles: IStyleMap = {

    dropdownChevron: {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    }

};

export class FilterTagInput extends React.PureComponent<IProps, IState> {

    private readonly id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            open: false,
            defaultValue: []
        };

        this.id = this.props.id || "filter-tag-input";

    }

    public render() {

        const options = TagOptions.fromTags(this.props.tagsDBProvider().tags());

        const tagsPopoverPlacement = this.props.tagPopoverPlacement || 'bottom';

        return (

            <div>

                <SimpleTooltipEx text={this.props.tooltip || ""}
                                 disabled={this.state.open}>

                    <Button color="light"
                            id={this.id}
                            size="sm"
                            disabled={this.props.disabled}
                            onClick={() => this.toggle(! this.state.open)}
                            className="header-filter-clickable p-1 pl-2 pr-2 border">

                        <i className="fa fa-tag doc-button doc-button-selectable mr-1"/>
                        <span className="d-none-mobile">Tags</span>

                        <div style={Styles.dropdownChevron}></div>

                    </Button>

                </SimpleTooltipEx>

                <Popover placement={tagsPopoverPlacement}
                         isOpen={this.state.open}
                         target={this.id}
                         trigger="legacy"
                         fade={false}
                         delay={0}
                         toggle={() => this.toggle(false)}
                         className="tag-input-popover">

                    <PopoverBody className="shadow">

                        <div className="pt-1 pb-1">
                            <strong>Filter documents by tag:</strong>
                        </div>

                        <Select
                            escapeClearsValue
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            className="filter-tag-input"
                            classNamePrefix="select"
                            onChange={this.handleChange}
                            defaultValue={this.state.defaultValue}
                            options={options}
                        />

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key.toLowerCase() === "escape") {
            this.toggle(false);
        }

        if (event.getModifierState("Control") && event.key.toLowerCase() === "enter") {
            this.toggle(false);
        }

    }

    private toggle(open: boolean) {

        Blackout.toggle(open);
        this.setState({...this.state, open});

    }

    private handleChange(selectedOptions: any) {

        // as so as we handle the change we toggle off

        const defaultValue: TagOption[] = selectedOptions;

        this.props.filteredTags.set(TagOptions.toTags(selectedOptions));

        this.props.refresher();

        Blackout.disable();
        this.setState({defaultValue, open: false});

    }

}

interface IProps {

    readonly id?: string;

    readonly disabled?: boolean;

    readonly tagsDBProvider: () => TagsDB;

    readonly refresher: () => void;

    readonly filteredTags: FilteredTags;

    readonly tooltip?: string;

    readonly tagPopoverPlacement?: Popper.Placement;

}

interface IState {
    readonly open: boolean;
    readonly defaultValue: TagOption[];
}

