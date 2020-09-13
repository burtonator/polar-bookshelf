import * as React from "react";
import clsx from "clsx";
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}


export const MUIButtonBar = deepMemo((props: IProps) => {

    const className = clsx("gap-box", props.className);

    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 flexWrap: 'nowrap',
                 ...(props.style || {})
             }}
             className={className}>

            {props.children}

        </div>
    );
});
