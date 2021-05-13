import * as React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import { useZenModeCallbacks } from './ZenModeStore';
import {useFullScreenToggle} from "../../../apps/doc/src/toolbar/FullScreenButton";

const globalKeyMap = keyMapWithGroup({
    group: "Zen Mode",
    groupPriority: -1,
    keyMap: {

        TOGGLE_ZEN_MODE: {
            icon: <MenuIcon/>,
            name: "Toggle Zen Mode",
            description: "Toggle 'zen' mode",
            sequences: ['F9']
        },
        TOGGLE_FULL_SCREEN: {
            icon: <MenuIcon/>,
            name: "Toggle Full Screen",
            description: "Toggle Full Screen",
            sequences: ['F10']
        },

    }
});

export const ZenModeGlobalHotKeys = React.memo(function ZenModeGlobalHotKeys() {

    const {toggleZenMode} = useZenModeCallbacks();
    const fullScreenToggle = useFullScreenToggle();

    const globalKeyHandlers = {
        TOGGLE_ZEN_MODE: toggleZenMode,
        TOGGLE_FULL_SCREEN: fullScreenToggle
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


