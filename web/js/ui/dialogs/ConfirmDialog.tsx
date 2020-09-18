import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from "@material-ui/core/Box";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import isEqual from 'react-fast-compare';
import {InputCompleteListener} from "../../mui/complete_listeners/InputCompleteListener";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import {MUIDialog} from "./MUIDialog";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        danger: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        error: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        warning: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },
        info: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
        },
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        root: {
        },
        subtitle: {
            fontSize: '1.25rem'
        }
    }),
);

export type AlertType = 'danger' | 'error' | 'warning' | 'success' | 'info';

export interface ConfirmDialogProps {
    readonly title: string;
    readonly subtitle: string | JSX.Element;
    readonly onCancel?: Callback;
    readonly onAccept: Callback;
    readonly type?: AlertType;
    readonly autoFocus?: boolean;

    /**
     * The text to use for the cancel button.
     */
    readonly cancelText?: string;

    /**
     * The text to use for the accept button.
     */
    readonly acceptText?: string;

    /**
     * When true, do not show the cancel button.
     */
    readonly noCancel?: boolean

    // TOD: we need noCancel

}

export const ConfirmDialog = React.memo((props: ConfirmDialogProps) => {

    const [open, setOpen] = React.useState(true);


    const classes = useStyles();

    const onCancel = props.onCancel || NULL_FUNCTION;

    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | undefined) => {

        if (reason !== undefined) {
            onCancel();
        }

        setOpen(false);
    };

    const handleCancel = () => {
        onCancel();
        setOpen(false);
    };

    const handleAccept = () => {
        props.onAccept();
        setOpen(false);
    };

    const type: AlertType = props.type || 'error';

    // tslint:disable-next-line:no-string-literal
    const palette = classes[type];


    return (
        <MUIDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener onComplete={handleAccept} onCancel={handleCancel}>
                    <>
                        <DialogTitle id="alert-dialog-title" className={palette}>
                            {props.title}
                        </DialogTitle>

                        <DialogContent>

                            <Box pt={1}>
                                <DialogContentText id="alert-dialog-description"
                                                   className={classes.subtitle}>
                                    {props.subtitle}
                                </DialogContentText>
                            </Box>

                        </DialogContent>
                        <DialogActions>

                            {! props.noCancel &&
                            <Button className={classes.cancelButton}
                                    onClick={handleCancel}
                                    size="large">
                                {props.cancelText || 'Cancel'}
                            </Button>}

                            <Button className={palette}
                                    onClick={handleAccept}
                                    size="large"
                                    variant="contained"
                                    autoFocus={props.autoFocus}>
                                {props.acceptText || 'Accept'}
                            </Button>

                        </DialogActions>
                    </>
                </InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts>

        </MUIDialog>
    );
}, isEqual);
