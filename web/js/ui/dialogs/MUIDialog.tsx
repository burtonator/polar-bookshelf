import {deepMemo} from "../../react/ReactUtils";
import Dialog, {DialogProps} from "@material-ui/core/Dialog";
import React from "react";

/**
 * Dialog that prevents events from being handled up the tree.
 */
export const MUIDialog = deepMemo((props: DialogProps) => {

    return (

        <Dialog {...props}
                transitionDuration={50}>

            {props.children}

        </Dialog>
    );

});
