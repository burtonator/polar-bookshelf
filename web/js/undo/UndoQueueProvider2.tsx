import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {UndoQueues2} from "./UndoQueues2";

const UndoQueueContext = React.createContext(UndoQueues2.create({limit: 50}));

export function useUndoQueue() {
    return React.useContext(UndoQueueContext);
}

interface IProps {
    readonly children: JSX.Element;
}

export const UndoQueueProvider2 = deepMemo(function UndoQueueProvider(props: IProps) {
    return (
        // <UndoQueueContext.Provider>
            <>
                {/*<UndoQueueGlobalHotKeys/>*/}
                {props.children}
            </>
        // </UndoQueueContext.Provider>
    );
});
