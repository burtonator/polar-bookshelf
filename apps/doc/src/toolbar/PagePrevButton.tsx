import * as React from "react";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import IconButton from "@material-ui/core/IconButton";

export const PagePrevButton = React.memo(() => {

    const {onPagePrev} = useDocViewerCallbacks();
    const {pageNavigator, page} = useDocViewerStore(['pageNavigator', 'page']);

    return (
        <IconButton disabled={!pageNavigator || page <= 1}
                    onClick={onPagePrev}>
            <ArrowUpwardIcon/>
        </IconButton>
    );

});
