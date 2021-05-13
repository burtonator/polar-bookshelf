import React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from './SideNavStore';

const globalKeyMap = keyMapWithGroup({
    group: "Side Navigation",
    keyMap: {
        CLOSE_CURRENT_TAB: {
            name: "Close doc",
            description: "Close doc",
            sequences: ['shift+ctrl+L', 'shift+command+l']
        },
        PREV_TAB: {
            name: "Jump to previous doc",
            description: "Jump to previous doc",
            sequences: ['shift+command+ArrowUp', 'shift+ctrl+ArrowUp']
        },
        NEXT_TAB: {
            name: "Jump to next doc",
            description: "Jump to next doc",
            sequences: ['shift+command+ArrowDown', 'shift+ctrl+ArrowDown']
        }
    }
});

export const SideNavGlobalHotKeys = React.memo(function SideNavGlobalHotKeys() {

    const {closeCurrentTab, prevTab, nextTab} = useSideNavCallbacks();

    const globalKeyHandlers = {
        CLOSE_CURRENT_TAB: closeCurrentTab,
        PREV_TAB: prevTab,
        NEXT_TAB: nextTab
    };

    if (! SIDE_NAV_ENABLED) {
        return null;
    }

    return (
        <>
            <GlobalKeyboardShortcuts
                keyMap={globalKeyMap}
                handlerMap={globalKeyHandlers}/>
        </>
    );

});

