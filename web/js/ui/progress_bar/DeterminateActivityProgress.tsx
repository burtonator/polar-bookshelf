import React from 'react';
import {deepMemo} from "../../react/ReactUtils";

interface IProps {
    readonly id?: string;
    readonly value: number;
}

/**
 * Simple progress bar that we can display at any time on a page without
 * complicated rendering issues or requiring React to be used.  This allows
 * us to easily show a GUI for a download at any point in time.
 */
export const DeterminateActivityProgress = deepMemo((props: IProps) => {

    return (
        <progress id={props.id}
                  value={props.value}
                  style={{
                      height: '4px',
                      width: '100%',
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      zIndex: 99999999999,
                      borderTop: 0,
                      borderLeft: 0,
                      borderBottom: 0,
                      padding: 0,
                      borderRadius: 0
                  }}/>
    );

});

