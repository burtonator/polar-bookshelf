import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useDockLayoutCallbacks } from './DockLayoutStore';
import MenuIcon from '@material-ui/icons/Menu';

const globalKeyMap = keyMapWithGroup({
    group: "Sidebar Panels",
    groupPriority: -1,
    keyMap: {

        TOGGLE_LEFT: {
            icon: <MenuIcon/>,
            name: "Toggle outline",
            description: "Hide/show outline",
            sequences: ['[']
        },

        TOGGLE_RIGHT: {
            icon: <MenuIcon/>,
            name: "Toggle annotations sidebar",
            description: "Hide/show annotations sidebar",
            sequences: [']']
        },

    }
});

export const DockLayoutGlobalHotKeys = React.memo(function DockLayoutGlobalHotKeys() {

    const {toggleSide} = useDockLayoutCallbacks();

    const globalKeyHandlers = {
        TOGGLE_LEFT: () => toggleSide('left'),
        TOGGLE_RIGHT: () => toggleSide('right'),
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


