import React from 'react';
import Menu from '@material-ui/core/Menu';
import {MUIDocDropdownMenuItems} from './MUIDocDropdownMenuItems';
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly anchorEl: HTMLElement;
    readonly onClose: Callback;
}

export const MUIDocDropdownMenu = deepMemo((props: IProps) => {
    const {anchorEl} = props;

    return (
        <Menu
            id="doc-dropdown-menu"
            anchorEl={anchorEl}
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            transformOrigin={{vertical: "top", horizontal: "center"}}
            open={Boolean(anchorEl)}
            onClose={() => props.onClose()}
            onClick={() => props.onClose()}>

            <MUIDocDropdownMenuItems/>

        </Menu>
    );
});
