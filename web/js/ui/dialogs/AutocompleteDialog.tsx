import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MUICreatableAutocomplete, {MUICreatableAutocompleteProps} from "../../mui/autocomplete/MUICreatableAutocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import DialogContentText from "@material-ui/core/DialogContentText";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Dialog from '@material-ui/core/Dialog';
import {InputCompleteListener} from "../../mui/complete_listeners/InputCompleteListener";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import {MUIDialog} from "./MUIDialog";

const useStyles = makeStyles((theme) =>
    createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            minWidth: '350px',
            width: '450px',
            maxWidth: '100vh',
        },
        description: {
            fontSize: '1.25rem'
        }
    }),
);

export interface AutocompleteDialogProps<T> extends MUICreatableAutocompleteProps<T> {
    readonly title?: string;
    readonly description?: string | JSX.Element;
    readonly onCancel: () => void;
    readonly onDone: (values: ReadonlyArray<T>) => void;

}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export function AutocompleteDialog<T>(props: AutocompleteDialogProps<T>) {

    const classes = useStyles();

    const [state, setState] = React.useState<IState>({
        open: true
    });

    const activeRef = React.useRef(false);

    const closeDialog = () => {
        setState({open: false});
    };

    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };

    let selectedOptions: ReadonlyArray<T>
        = props.defaultOptions ? props.defaultOptions.map(current => current.value) : [];

    const handleComplete = () => {
        closeDialog();
        props.onDone(selectedOptions);
    };

    const handleChange = (newOptions: ReadonlyArray<T>) => {
        selectedOptions = newOptions;
    };

    // useInputCompleteWindowListener({onComplete: handleComplete, onCancel: handleCancel});

    function handleOpen(open: boolean) {
        setTimeout(() => activeRef.current = open, 1);
    }

    return (

        <MUIDialog open={state.open}
                   onClose={handleCancel}
                   maxWidth="md"
                   aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener onComplete={handleComplete}
                                       onCancel={handleCancel}
                                       completable={() => ! activeRef.current}>
                    <>

                        {props.title &&
                        <DialogTitle>{props.title}</DialogTitle>}

                        <DialogContent>

                            {props.description &&
                            <Box pt={1}>
                                <DialogContentText className={classes.description}>
                                    {props.description}
                                </DialogContentText>
                            </Box>}

                            <MUICreatableAutocomplete {...props}
                                                      onOpen={handleOpen}
                                                      autoFocus={true}
                                                      onChange={handleChange}/>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleComplete}
                                    size="large"
                                    variant="contained"
                                    color="primary">
                                Done
                            </Button>
                        </DialogActions>
                    </>
                </InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts>

        </MUIDialog>
    );
};
