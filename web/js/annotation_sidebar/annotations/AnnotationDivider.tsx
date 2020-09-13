import * as React from "react";
import {deepMemo} from "../../react/ReactUtils";
import Divider from "@material-ui/core/Divider";

export const AnnotationDivider = deepMemo(() => (
    <div style={{padding: '10px'}}>
        <Divider/>
    </div>
));
