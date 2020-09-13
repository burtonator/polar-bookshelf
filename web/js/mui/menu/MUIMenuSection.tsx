import * as React from "react";
import {deepMemo} from "../../react/ReactUtils";
import {MUIMenuSubheader} from "./MUIMenuSubheader";

interface IProps {
    readonly title: string;
    readonly children: React.ReactNode | ReadonlyArray<React.ReactNode>;
}

function toArray(children: React.ReactNode | ReadonlyArray<React.ReactNode>) {
    return Array.isArray(children) ? children : [children];
}

export const MUIMenuSection = deepMemo((props: IProps) => {

    const children = toArray(props.children)
        .filter(current => current !== false)

    if (children.length === 0) {
        return null;
    }

    return (
        <>
            <MUIMenuSubheader>
                {props.title}
            </MUIMenuSubheader>

            {props.children}

        </>
    );

})
//
// const Test = () => {
//     return (
//         <MUIMenuSection title='hello'>
//             <div>hello</div>
//             <div>world</div>
//         </MUIMenuSection>
//     );
// }
