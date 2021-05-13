import React from "react";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useDocMetadataEditorForSelected} from "./doc_metadata_editor/DocMetadataEditorHook";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Documents",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag selected doc",
                sequences: ['t'],
            },
            DELETE: {
                name: "Delete",
                description: "Delete selected doc",
                sequences: ['Delete', 'Backspace'],
            },
            FLAG: {
                name: "Flag",
                description: "Flag selected doc",
                sequences: ['f']
            },
            ARCHIVE: {
                name: "Archive",
                description: "Archive selected doc",
                sequences: ['a']
            },
            RENAME: {
                name: "Rename",
                description: "Rename selected doc",
                sequences: ['r']
            },
            OPEN: {
                name: "Open",
                description: "Open selected doc in doc viewer",
                sequences: ['Enter']
            },
            UPDATE_METADATA: {
                name: "Update Document Metadata",
                description: "Update doc metadata",
                sequences: ['m']
            },

        }
    });

export const DocRepoGlobalHotKeys = React.memo(function DocRepoGlobalHotKeys() {

    const callbacks = useDocRepoCallbacks();

    const docMetadataEditorForSelected = useDocMetadataEditorForSelected();

    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen,
        UPDATE_METADATA: docMetadataEditorForSelected
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
