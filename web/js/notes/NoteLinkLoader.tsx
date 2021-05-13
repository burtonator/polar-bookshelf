import * as React from 'react';
import {useHistory} from "react-router-dom";
import {useRefValue} from "../hooks/ReactHooks";
import {BlockNameStr, BlockIDStr} from "./store/BlocksStore";

export type BlockTargetStr = BlockIDStr | BlockNameStr;

export function useNoteLinkLoader() {

    const history = useHistory();
    const historyRef = useRefValue(history);

    return React.useCallback((target: BlockTargetStr) => {

        const newURL = '/notes/' + target;
        historyRef.current.push(newURL);

    }, [historyRef]);

}

export function createNoteLink(target: BlockTargetStr) {
    return '/notes/' + target
}
