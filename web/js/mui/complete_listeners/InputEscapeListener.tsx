import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {GlobalHotKeys} from "react-hotkeys";
import {deepMemo} from "../../react/ReactUtils";

const globalKeyMap = {
    ESCAPE: ['Escape'],
};

interface IProps {
    readonly onEscape: Callback;
    readonly children: JSX.Element;
}

/**
 * Handle escape.  We have to use a global key binding so that it's not done at
 * root and a custom event listener so we abort when they type in an <input>
 * @param props @constructor
 */
export const InputEscapeListener = deepMemo((props: IProps) => {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Escape') {
            props.onEscape();
            event.stopPropagation();
            event.preventDefault();
            return;
        }

    };

    const handlers = {
        ESCAPE: () => props.onEscape()
    };

    return (
        <div onKeyDown={handleKeyDown}>
            <GlobalHotKeys allowChanges keyMap={globalKeyMap} handlers={handlers}/>
            {props.children}
        </div>
    );

});
