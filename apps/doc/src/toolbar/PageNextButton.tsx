import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import * as React from "react";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import IconButton from "@material-ui/core/IconButton";

export const PageNextButton = deepMemo(function PageNextButton() {

    const {onPageNext} = useDocViewerCallbacks();
    const {pageNavigator, page} = useDocViewerStore(['pageNavigator', 'page']);

    return (
        <IconButton size="small" disabled={!pageNavigator || page >= pageNavigator.count}
                    onClick={onPageNext}>
            <ArrowDownwardIcon/>
        </IconButton>
    );

});
