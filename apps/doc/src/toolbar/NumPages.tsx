import * as React from "react";

interface IProps {
    readonly nrPages: number;
}

export const NumPages = (props: IProps) => (
    <div className="ml-1 mt-auto mb-auto"
         style={{fontSize: "1.3rem", userSelect: 'none'}}>
        of {props.nrPages}
    </div>
);
