import React from "react";
import Divider from "@material-ui/core/Divider";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import isEqual from "react-fast-compare";
import { MUIDocTagButton } from "./buttons/MUIDocTagButton";
import {MUIDocArchiveButton} from "./buttons/MUIDocArchiveButton";
import { MUIDocFlagButton } from "./buttons/MUIDocFlagButton";
import { MUIDocDeleteButton } from "./buttons/MUIDocDeleteButton";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {MUICheckboxIconButton} from "../../../../web/js/mui/MUICheckboxIconButton";
import {ChromeExtensionInstallBar} from "../ChromeExtensionInstallBar";
import {MUIIconButton} from "../../../../web/js/mui/icon_buttons/MUIIconButton";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
    }),
);

const SelectionActiveButtons = React.memo(function SelectionActiveButtons() {
    const callbacks = useDocRepoCallbacks();

    return (
        <MUIButtonBar>
            <>
                <MUIDocTagButton onClick={callbacks.onTagged} size="medium"/>
                <MUIDocArchiveButton onClick={callbacks.onArchived} size="medium"/>
                <MUIDocFlagButton onClick={callbacks.onFlagged} size="medium"/>
                <Divider orientation="vertical" variant="middle" flexItem/>

                <MUIDocDeleteButton size="medium"
                                    onClick={callbacks.onDeleted}/>
            </>
        </MUIButtonBar>
    );
});

export const DocRepoTableToolbar = React.memo(function DocRepoTableToolbar() {

    const {view, selected}
        = useDocRepoStore(['view', 'selected']);

    const callbacks = useDocRepoCallbacks();
    const classes = useStyles();
    const {setLeftDockOpen} = useDocRepoCallbacks();
    const {isLeftDockOpen} = useDocRepoStore(['isLeftDockOpen']);

    const {setSelected} = callbacks;

    const handleCheckbox = React.useCallback((checked: boolean) => {
        // TODO: this is wrong... the '-' button should remove the checks...
        // just like gmail.
        if (checked) {
            setSelected('all')
        } else {
            setSelected('none');
        }
    }, [setSelected]);

    const toggleLeftDock = () => {
        setLeftDockOpen(!isLeftDockOpen);
    };

    return (
        <Paper square
               className={classes.root}>

                <div style={{
                         display: 'flex',
                         flexGrow: 1
                     }}>

                    <div>

                        <MUIIconButton onClick={toggleLeftDock}>
                            <MenuIcon/>
                        </MUIIconButton>
                        <MUICheckboxIconButton
                            indeterminate={selected.length > 0 && selected.length < view.length}
                            checked={selected.length === view.length && view.length !== 0}
                            onChange={(event, checked) => handleCheckbox(checked)}/>
                    </div>

                    {selected.length > 0 && (
                        <SelectionActiveButtons/>
                    )}

                </div>

                <ChromeExtensionInstallBar/>

                <DocRepoFilterBar/>

        </Paper>
    );
}, isEqual);
