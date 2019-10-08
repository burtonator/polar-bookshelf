import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {FilterTagInput} from '../FilterTagInput';
import {TagsDB} from '../TagsDB';
import {FilteredTags} from '../FilteredTags';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';

const log = Logger.create();


class Styles {

}

export class DocRepoFilterBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const Right = () => {

            if (this.props.right) {
                return this.props.right;
            } else {
                return <div/>;
            }

        };

        return (

            <div id="filter-bar"
                 style={{
                     display: 'flex',
                     marginLeft: 'auto',
                     justifyContent: 'flex-end'
                 }}>

                <div className="mr-2"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <SimpleTooltipEx text="Only show flagged documents.">

                            <ToggleButton id="toggle-flagged"
                                          label="flagged"
                                          initialValue={false}
                                          onChange={value => this.props.onToggleFlaggedOnly(value)}/>

                        </SimpleTooltipEx>

                    </div>

                </div>

                <div className="header-filter-box mr-1"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <SimpleTooltipEx text={`
                                           Show both archived and unarchived
                                           documents.  Archived documents are
                                           hidden by default.
                                         `}>

                            <ToggleButton id="toggle-archived"
                                          label="archived"
                                          initialValue={false}
                                          onChange={value => this.props.onToggleFilterArchived(value)}/>

                        </SimpleTooltipEx>

                    </div>

                </div>

                <div className="header-filter-box header-filter-tags mr-1 d-none-desktop"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <FilterTagInput id="filter-tag-input"
                                    tagsDBProvider={this.props.tagsDBProvider}
                                    refresher={this.props.refresher}
                                    tooltip="Filter the document list by a specific tag."
                                    filteredTags={this.props.filteredTags} />

                </div>

                <div className="header-filter-box mr-1 d-none-mobile"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="header-filter-box">


                        <SimpleTooltipEx text={`
                                            Filter the document list by the title of the document.
                                         `}>

                            <InputGroup size="sm">

                                <Input id="filter_title"
                                       type="text"
                                       placeholder="Filter by title"
                                       onChange={(value) => this.props.onFilterByTitle(value.target.value)}/>

                            </InputGroup>


                        </SimpleTooltipEx>

                    </div>

                </div>

                <Right/>

            </div>

        );

    }



}

export interface IProps {

    /**
     * Called when the flagged toggle is enabled/disabled
     */
    readonly onToggleFlaggedOnly: ToggleCallback;

    /**
     * Called when the archive toggle is enabled/disabled
     */
    readonly onToggleFilterArchived: ToggleCallback;

    /**
     * Called when the title is filtered with the current value of the title to
     * filter by.  When the title is "" then no filter is applied.
     */
    readonly onFilterByTitle: (title: string) => void;

    /**
     * An index of the currently available tags.
     */
    readonly tagsDBProvider: () => TagsDB;

    /**
     * A function to refresh the table when new results have been selected.
     */
    readonly refresher: () => void;

    /**
     * A provider that can be updated with the filtered tags that are currently
     * being used.
     */
    readonly filteredTags: FilteredTags;

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

}

interface IState {

}

export type ToggleCallback = (value: boolean) => void;
