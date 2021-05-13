import * as React from 'react';
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import FlagIcon from '@material-ui/icons/Flag';
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";

export interface IProps {

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

}

export const DocRepoFilterBar = deepMemo(function DocRepoFilterBar(props: IProps) {

    const {filters} = useDocRepoStore(['filters']);
    const callbacks = useDocRepoCallbacks();

    const {setFilters} = callbacks;

    const Right = () => {

        if (props.right) {
            return props.right;
        } else {
            return <div/>;
        }

    };

    return (

        <MUIButtonBar>

            <MUIToggleButton id="toggle-flagged"
                             tooltip="Show only flagged docs"
                             size="medium"
                             label="flagged"
                             icon={<FlagIcon/>}
                             initialValue={filters.flagged}
                             onChange={value => setFilters({...filters, flagged: value})}/>
            <MUIToggleButton id="toggle-archived"
                             tooltip="Toggle archived docs"
                             size="medium"
                             label="archived"
                             initialValue={filters.archived}
                             onChange={value => setFilters({...filters, archived: value})}/>
            <MUISearchBox2 id="filter_title"
                           placeholder="Search by title"
                           initialValue={filters.title}
                           autoComplete="off"
                           onChange={text => setFilters({...filters, title: text})}/>
        </MUIButtonBar>
    );

});

