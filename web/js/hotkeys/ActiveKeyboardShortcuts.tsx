import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import {deepMemo} from '../react/ReactUtils';
import {GlobalKeyboardShortcuts} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useActiveKeyboardShortcutsStore, useActiveKeyboardShortcutsCallbacks } from './ActiveKeyboardShortcutsStore';
import { ActiveKeyboardShortcutsTable } from './ActiveKeyboardShortcutsTable';
import {useKeyboardShortcutsCallbacks, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {createStyles} from '@material-ui/styles';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() =>
    createStyles({
        shortcutDialog: {
            minWidth: 'min(80vw, 700px)',
            maxWidth: 'min(80vw, 700px)',
        },
    }),
);


const keyMap = {
    SHOW_ALL_HOTKEYS: {
        group: 'Help',
        name: 'Show Keyboard Shortcuts',
        description: "Show active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};


interface ActiveKeyboardShortcutsDialogProps {
    readonly onClose: () => void;
}

export const ActiveKeyboardShortcutsDialog = deepMemo(function ActiveKeyboardShortcutsDialog(props: ActiveKeyboardShortcutsDialogProps) {

    const classes = useStyles();
    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])
    const {setActive} = useKeyboardShortcutsCallbacks()

    useComponentDidMount(() => setActive(false));
    useComponentWillUnmount(() => setActive(true));

    return (
        <Dialog transitionDuration={50}
                maxWidth="md"
                open={true}
                onClose={props.onClose}>
            <div className={classes.shortcutDialog}>
                <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
                <DialogContent>
                    <ActiveKeyboardShortcutsTable shortcuts={shortcuts}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose}
                            size="large"
                            color="primary"
                            variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );

});


export const ActiveKeyboardShortcuts = deepMemo(function ActiveKeyboardShortcuts() {

    const {showActiveShortcuts} = useActiveKeyboardShortcutsStore(['showActiveShortcuts']);
    const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks();

    function handleClose() {
        setShowActiveShortcuts(false);
    }

    const handlers = {
        SHOW_ALL_HOTKEYS: () => setShowActiveShortcuts(true)
    };

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap}
                                     handlerMap={handlers}/>

            {showActiveShortcuts && <ActiveKeyboardShortcutsDialog onClose={handleClose}/>}

        </>
    );

});
