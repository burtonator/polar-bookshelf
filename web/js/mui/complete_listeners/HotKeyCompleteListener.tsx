import * as React from 'react';
import {HotKeys} from "react-hotkeys";
import {KeyMaps} from "../../hotkeys/KeyMaps";
import {HotKeyCallbacks} from "../../hotkeys/HotKeyCallbacks";

const keyMap = KeyMaps.keyMap({
   group: "Actions",
   keyMap: {
       COMPLETE: {
           name: "Complete Action",
           description: "Complete the current action",
           sequences: ['ctrl+return', 'command+return'],
       },
   }
});

interface IProps {
    readonly onComplete: () => void;
    readonly children: React.ReactElement;
}

/**
 * @Deprecated
 */
export const HotKeyCompleteListener = (props: IProps) => {

    const handlers = {
        COMPLETE: HotKeyCallbacks.withPreventDefault(props.onComplete)
    };

    return (
        <HotKeys allowChanges
                 keyMap={keyMap}
                 handlers={handlers}>

            {props.children}

        </HotKeys>
    );

};
