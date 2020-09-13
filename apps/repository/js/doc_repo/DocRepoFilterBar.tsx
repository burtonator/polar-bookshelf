import * as React from 'react';
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import FlagIcon from '@material-ui/icons/Flag';
import Grid from "@material-ui/core/Grid";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import Tooltip from '@material-ui/core/Tooltip';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export interface IProps {

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

}

export const DocRepoFilterBar = deepMemo((props: IProps) => {

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

        <div id="filter-bar"
             style={{}}>

            <Grid spacing={1}
                  container
                  direction="row"
                  justify="flex-start"
                  style={{flexWrap: 'nowrap'}}
                  alignItems="center">

                <Grid item>
                    <Tooltip title="Hide/show flaged documents">
                        <MUIToggleButton id="toggle-flagged"
                                         size="medium"
                                         label="flagged"
                                         icon={<FlagIcon/>}
                                         initialValue={filters.flagged}
                                         onChange={value => setFilters({...filters, flagged: value})}/>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip title="Hide/show archived documents">
                        <MUIToggleButton id="toggle-archived"
                                         size="medium"
                                         label="archived"
                                         initialValue={filters.archived}
                                         onChange={value => setFilters({...filters, archived: value})}/>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <MUISearchBox2 id="filter_title"
                                   placeholder="Search by title"
                                   initialValue={filters.title}
                                   onChange={text => setFilters({...filters, title: text})}/>

                </Grid>

            </Grid>

            {/*<div className="mr-2"*/}
            {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

            {/*    <div className="checkbox-group">*/}

            {/*        <SimpleTooltipEx text="Only show flagged documents.">*/}

            {/*            <ToggleButton id="toggle-flagged"*/}
            {/*                          size="md"*/}
            {/*                          label="flagged"*/}
            {/*                          iconClassName="fas fa-flag"*/}
            {/*                          initialValue={false}*/}
            {/*                          onChange={value => this.props.onToggleFlaggedOnly(value)}/>*/}

            {/*        </SimpleTooltipEx>*/}

            {/*    </div>*/}

            {/*</div>*/}

            {/*<div className="header-filter-box mr-1"*/}
            {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

            {/*    <div className="checkbox-group">*/}

            {/*        <SimpleTooltipEx text={`*/}
            {/*                           Show both archived and unarchived*/}
            {/*                           documents.  Archived documents are*/}
            {/*                           hidden by default.*/}
            {/*                         `}>*/}

            {/*            <ToggleButton id="toggle-archived"*/}
            {/*                          size="md"*/}
            {/*                          label="archived"*/}
            {/*                          iconClassName="fas fa-check"*/}
            {/*                          initialValue={false}*/}
            {/*                          onChange={value => this.props.onToggleFilterArchived(value)}/>*/}

            {/*        </SimpleTooltipEx>*/}

            {/*    </div>*/}

            {/*</div>*/}

            {/*<div className="header-filter-box mr-1 d-none-mobile"*/}
            {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

            {/*    <div className="header-filter-box">*/}

            {/*        <SimpleTooltipEx text={`*/}
            {/*                            Filter the document list by the title of the document.*/}
            {/*                         `}>*/}

            {/*            <InputGroup size="md">*/}

            {/*                <InputFilter id="filter_title"*/}
            {/*                             placeholder="Search by title"*/}
            {/*                             style={{*/}
            {/*                                 width: '20em'*/}
            {/*                             }}*/}
            {/*                             onChange={(value) => this.props.onFilterByTitle(value)}/>*/}

            {/*            </InputGroup>*/}

            {/*        </SimpleTooltipEx>*/}

            {/*    </div>*/}

            {/*</div>*/}

            {/*<Right/>*/}

        </div>

    );

});

