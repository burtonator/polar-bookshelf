import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import {IDStr} from "polar-shared/src/util/Strings";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from '@material-ui/core/ListItem';
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import DialogContentText from "@material-ui/core/DialogContentText";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import { MUIDialog } from "./MUIDialog";

export interface ISelectOption<V> {
    readonly id: IDStr;
    readonly label: string;
    readonly value: V;
    // TODO icon in the future.
}

export interface SelectDialogProps<V> {

    readonly title: string;

    readonly description?: string;

    readonly options: ReadonlyArray<ISelectOption<V>>;

    readonly defaultValue?: IDStr;

    readonly onCancel: () => void;

    readonly onDone: (selected: ISelectOption<V>) => void;

}

/**
 * Select from a list of options.
 */
export const SelectDialog = function<V>(props: SelectDialogProps<V>) {

    const [open, setOpen] = React.useState(true);

    const handleCancel = () => {
        props.onCancel();
        setOpen(false);
    }

    const handleDone = (option: ISelectOption<V>) => {
        // noop
        setOpen(false);
        props.onDone(option);
    }

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {

        props.onCancel();

        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

    };

    function convertOptionToListItem(option: ISelectOption<V>) {
        return (
            <ListItem key={option.id}
                      autoFocus={option.id === props.defaultValue}
                      button
                      onClick={() => handleDone(option)}>
                <ListItemText primary={option.label} />
            </ListItem>
        );
    }

    return (

        <MUIDialog open={open}
                   onClose={handleClose}
                   aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts>
                <>
                    <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>

                    <DialogContent>

                        {props.description !== undefined && (
                            <Box pt={1}>
                                <DialogContentText id="dialog-description">
                                    {props.description}
                                </DialogContentText>
                            </Box>
                        )}

                        <List>
                            {props.options.map(convertOptionToListItem)}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </DialogActions>
                </>
            </WithDeactivatedKeyboardShortcuts>

        </MUIDialog>

    );

};
