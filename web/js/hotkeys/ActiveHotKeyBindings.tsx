import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import grey from "@material-ui/core/colors/grey";
import Dialog from '@material-ui/core/Dialog';
import {deepMemo} from '../react/ReactUtils';
import {
    IBaseKeyboardShortcut,
    useKeyboardShortcutsStore
} from '../keyboard_shortcuts/KeyboardShortcutsStore';
import {GlobalKeyboardShortcuts} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";

interface KeySequenceProps {
    readonly sequence: string;
}

const KeySequence = (props: KeySequenceProps) => {

    return (
        <div style={{
                padding: '5px',
                borderRadius: '2px',
                border: `1px solid ${grey[500]}`,
                backgroundColor: grey[200],
                color: grey[900],
                margin: '5px'
             }}>
            {props.sequence}
        </div>
    )

}

interface ActiveKeyBindingProps extends IBaseKeyboardShortcut {


}

const ActiveBinding = (props: ActiveKeyBindingProps) => {

    return (
        <TableRow>

            <TableCell>
                <b>{props.name || 'unnamed'}</b>
            </TableCell>

            <TableCell>
                {props.description}
            </TableCell>

            <TableCell>
                <div style={{display: 'flex'}}>
                    {props.sequences.map((current, idx) =>
                                       <KeySequence key={idx} sequence={current}/>)}
                </div>
            </TableCell>

        </TableRow>
    );

}

export const ActiveHotKeys = () => {

    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])

    const bindings = Object.values(shortcuts)
                           .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    return (
        <Table size="small">
            <TableBody>
                {bindings.map((binding, idx) =>
                                  <ActiveBinding key={idx} {...binding}/>)}

            </TableBody>

        </Table>
    );

}

const keyMap = {
    SHOW_ALL_HOTKEYS: {
        name: 'Show Keyboard Shortcuts',
        description: "Show the currently active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};

export const ActiveHotKeyBindings = deepMemo(() => {

    const [open, setOpen] = React.useState(false);

    function handleClose() {
        setOpen(false);
    }

    const handlers = {
        SHOW_ALL_HOTKEYS: () => {
            setOpen(true)
        }
    };

    return (
        <>
        <GlobalKeyboardShortcuts keyMap={keyMap}
                                 handlerMap={handlers}/>

            <Dialog fullWidth={true}
                    maxWidth="md"
                    open={open}
                    onClose={handleClose}>
                <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
                <DialogContent>
                    <ActiveHotKeys/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                            color="primary"
                            variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );

});
