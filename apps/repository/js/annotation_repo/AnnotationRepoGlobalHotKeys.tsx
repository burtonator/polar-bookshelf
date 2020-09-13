import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {KeyboardShortcutHandlers} from "../../../../web/js/keyboard_shortcuts/KeyboardShortcutHandlers";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Annotations",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag the current annotation.",
                sequences: ['t'],
            },
            DELETE: {
                name: "Delete",
                description: "Delete the current annotation.",
                sequences: ['Delete', 'Backspace'],
            }
        }
    });

export const AnnotationRepoGlobalHotKeys = React.memo(() => {

    const callbacks = useAnnotationRepoCallbacks();
    
    const globalKeyHandlers = {
        TAG: KeyboardShortcutHandlers.withPreventDefault(callbacks.onTagged),
        DELETE: KeyboardShortcutHandlers.withPreventDefault(callbacks.onDeleted),
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    };

    return (

        <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                 handlerMap={globalKeyHandlers}/>

    );

});
