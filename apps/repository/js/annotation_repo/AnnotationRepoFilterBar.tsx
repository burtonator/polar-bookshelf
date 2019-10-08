import * as React from 'react';
import {TagsDB} from '../TagsDB';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {UpdateFiltersCallback} from './AnnotationRepoFiltersHandler';
import {Placement} from 'popper.js';

export class AnnotationRepoFilterBar extends React.PureComponent<IProps, IState> {

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
                 }}>

                <div className="header-filter-box mr-1 pl-1"
                     style={{
                         whiteSpace: 'nowrap',
                         marginTop: 'auto',
                         marginBottom: 'auto',
                         flexGrow: 1
                     }}>

                    <div className="header-filter-box">

                        <InputGroup size="sm">

                            <Input id="filter_title"
                                   type="text"
                                   placeholder="Filter by annotation text"
                                   onChange={(value) => this.props.updateFilters({text: value.target.value})}/>

                        </InputGroup>

                    </div>

                </div>

                <Right/>

            </div>

        );

    }

}

export interface IProps {

    /**
     * An index of the currently available tags.
     */
    readonly tagsDBProvider: () => TagsDB;

    readonly updateFilters: UpdateFiltersCallback;

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

    readonly tagPopoverPlacement?: Placement;


}

interface IState {

}
