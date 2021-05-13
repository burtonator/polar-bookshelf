import {useActiveKeyboardShortcutsCallbacks, useActiveKeyboardShortcutsStore} from "./ActiveKeyboardShortcutsStore";
import {IKeyboardShortcutWithHandler, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {GlobalKeyboardShortcuts} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {ActiveKeyboardShortcutsTable2} from "./ActiveKeyboardShortcutsTable2";


const keyMap = {
    SHOW_ALL_HOTKEYS: {
        name: 'Show Keyboard Shortcuts',
        description: "Show active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};

interface ActiveKeyboardShortcutsDialogProps {
    readonly onClose: () => void;
    readonly onExecute: (event: React.MouseEvent | React.KeyboardEvent, shortcut: IKeyboardShortcutWithHandler) => void;
}

export const ActiveKeyboardShortcutsDialog = deepMemo(function ActiveKeyboardShortcutsDialog(props: ActiveKeyboardShortcutsDialogProps) {

    return (
        <Dialog fullWidth={true}
                transitionDuration={50}
                maxWidth="md"
                open={true}
                onClose={props.onClose}>
            <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
            <DialogContent>
                <ActiveKeyboardShortcutsTable2 onExecute={props.onExecute}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}
                        size="large"
                        color="primary"
                        variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

});


export const ActiveKeyboardShortcuts2 = deepMemo(() => {

    const {showActiveShortcuts} = useActiveKeyboardShortcutsStore(['showActiveShortcuts']);
    const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks();

    const handleClose = React.useCallback(() => {
        setShowActiveShortcuts(false);
    }, [setShowActiveShortcuts]);

    const handleExecute = React.useCallback((event: React.MouseEvent | React.KeyboardEvent,
                                             shortcut: IKeyboardShortcutWithHandler) => {
        handleClose();
        shortcut.handler(event);

    }, [handleClose]);

    const handlers = {
        SHOW_ALL_HOTKEYS: () => setShowActiveShortcuts(true)
    };

    // FIXME: setFilter and setIndex undefined on mount...

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap}
                                     handlerMap={handlers}/>

            {showActiveShortcuts && <ActiveKeyboardShortcutsDialog onClose={handleClose}
                                                                   onExecute={handleExecute}/>}

        </>
    );

});


