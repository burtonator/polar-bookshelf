import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleIcon from '@material-ui/icons/Title';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Divider from "@material-ui/core/Divider";
import FlagIcon from "@material-ui/icons/Flag";
import ArchiveIcon from "@material-ui/icons/Archive";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";


// NOTE that this CAN NOT be a functional component as it breaks MUI menu
// component.

interface IProps {

}

export const MUIDocDropdownMenuItems = React.memo(React.forwardRef((props: IProps, ref) => {

    const callbacks = useDocRepoCallbacks();

    const selected = callbacks.selectedProvider();

    // if (selected.length === 0) {
    //     // there's nothing to render now...
    //     return null;
    // }

    const isSingle = selected.length === 1;

    const single = selected.length === 1 ? selected[0] : undefined;

    return (
        <>
            {isSingle &&
                <MenuItem onClick={callbacks.onOpen}>
                    <ListItemIcon>
                        <SendIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Open Document"/>
                </MenuItem>}

            <MenuItem onClick={callbacks.onTagged}>
                <ListItemIcon>
                    <LocalOfferIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Tag"/>
            </MenuItem>

            {isSingle &&
                <MenuItem onClick={callbacks.onRename}>
                    <ListItemIcon>
                        <TitleIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Rename"/>
                </MenuItem>}

            <MenuItem onClick={callbacks.onFlagged}>
                <ListItemIcon>
                    <FlagIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Flag"/>
            </MenuItem>

            <MenuItem onClick={callbacks.onArchived}>
                <ListItemIcon>
                    <ArchiveIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Archive"/>
            </MenuItem>

            {single && single.url &&
                <MenuItem onClick={callbacks.onCopyOriginalURL}>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Copy Original URL"/>
                </MenuItem>}

            {isSingle && FeatureToggles.get('dev') &&
                <MenuItem onClick={callbacks.onCopyDocumentID}>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Copy Document ID"/>
                </MenuItem>}

            <Divider/>

            <MenuItem onClick={callbacks.onDeleted}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Delete"/>
            </MenuItem>
        </>
    );
}));
