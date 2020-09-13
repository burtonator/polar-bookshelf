import React from "react";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Documents",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag the currently selected document.",
                sequences: ['t'],
            },
            DELETE: {
                name: "Delete",
                description: "Delete the currently selected item.",
                sequences: ['Delete', 'Backspace'],
            },
            FLAG: {
                name: "Flag",
                description: "Flag the currently selected document",
                sequences: ['f']
            },
            ARCHIVE: {
                name: "Archive",
                description: "Archive the currently selected document.  Once archived the item is not visible by default.",
                sequences: ['a']
            },
            RENAME: {
                name: "Rename",
                description: "Rename the current document and assign it a new title.",
                sequences: ['r']
            },
            OPEN: {
                name: "Open",
                description: "Open the current document in the document viewer",
                sequences: ['Enter']
            }
        }
    });

export const DocRepoGlobalHotKeys = React.memo(() => {

    const callbacks = useDocRepoCallbacks();

    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen
    };

    const location = useLocationWithPathOnly();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/'>
                    <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                             handlerMap={globalKeyHandlers}/>
                </Route>

            </Switch>
        </BrowserRouter>

    );

});
