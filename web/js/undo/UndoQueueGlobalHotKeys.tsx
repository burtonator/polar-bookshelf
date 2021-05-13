import * as React from 'react';
import { keyMapWithGroup, GlobalKeyboardShortcuts } from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import { useUndoCallbacks } from './UndoStore';
import {useLogger} from "../mui/MUILogger";
import {useUndoQueue} from "./UndoQueueProvider2";

const globalKeyMap = keyMapWithGroup({
    group: "Undo",
    groupPriority: -1,
    keyMap: {

        UNDO: {
            name: "Undo",
            description: "Undo the last action",
            sequences: ['ctrl+z', 'command+Z']
        },

        REDO: {
            name: "Redo",
            description: "Redo the last action",
            sequences: ['shift+ctrl+z', 'shift+command+Z']
        },

    }
});

export const UndoQueueGlobalHotKeys = React.memo(function UndoQueueGlobalHotKeys() {

    const {undo, redo} = useUndoQueue();

    const log = useLogger();

    const handleUndo = React.useCallback(async () => {
        try {
            undo();
        } catch (e) {
            log.error("Could not handle undo: ", e);
        }
    }, [log, undo]);

    const handleRedo = React.useCallback(async () => {
        try {
            redo();
        } catch (e) {
            log.error("Could not handle redo: ", e);
        }
    }, [log, redo]);

    const globalKeyHandlers = {
        UNDO: handleUndo,
        REDO: handleRedo,
    };
    return (
        <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                 handlerMap={globalKeyHandlers}/>
    );

});


