// @NotStale

import React from "react";
import {KeyMaps} from "../../../../web/js/hotkeys/KeyMaps";
import {keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";

const keyMap = keyMapWithGroup({
    group: "Reviewer",
    keyMap: {
    }
});

export const ReviewerGlobalHotKeys = React.memo(() => {

    // return (
    //     <GlobalHotKeys allowChanges={true}
    //                    keyMap={keyMap}
    //                    handlers={globalKeyHandlers}/>
    //
    // );

    return null;

});
