import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleIcon from '@material-ui/icons/Title';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Divider from "@material-ui/core/Divider";
import FlagIcon from "@material-ui/icons/Flag";
import ArchiveIcon from "@material-ui/icons/Archive";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {Arrays} from "polar-shared/src/util/Arrays";
import {usePersistenceContext} from "../persistence_layer/PersistenceLayerApp";
import {Backend} from "polar-shared/src/datastore/Backend";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {Either} from "../../../../web/js/util/Either";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import {FADatabaseIcon} from "../../../../web/js/mui/MUIFontAwesome";

// NOTE that this CAN NOT be a functional component as it breaks MUI menu
// component.

interface IProps {

}

interface ErrorDialogOpts {
    readonly title: string;
    readonly subtitle: string;
}

function useErrorDialog() {

    const dialogs = useDialogManager();

    return React.useCallback((opts: ErrorDialogOpts) => {
        dialogs.confirm({
            ...opts,
            noCancel: true,
            type: 'error',
            onAccept: NULL_FUNCTION
        });

    }, [dialogs]);

}

export function useDocumentDownloadHandler() {

    const {selectedProvider} = useDocRepoCallbacks();
    const {persistenceLayerProvider} = usePersistenceContext();
    const errorDialog = useErrorDialog();

    return React.useCallback(() => {
        const selected = selectedProvider();
        const repoDocInfo = Arrays.first(selected);

        if (! repoDocInfo) {

            // no selected doc
            errorDialog({
                title: "No document selected",
                subtitle: "There is no document selected to download.",
            });
            return;

        }

        const persistenceLayer = persistenceLayerProvider();

        const fileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(repoDocInfo.docInfo));

        if (! fileRef) {

            errorDialog({
                title: "No document attached to file.",
                subtitle: "The document you're trying to save doesn't have an attachment (EPUB or PDF).",
            });

            return;
        }

        const {url} = persistenceLayer.getFile(Backend.STASH, fileRef);

        FileSavers.saveAs(url, fileRef.name);

    }, [selectedProvider, errorDialog, persistenceLayerProvider]);

}

export function useJSONDownloadHandler() {

    const {selectedProvider} = useDocRepoCallbacks();
    const {persistenceLayerProvider} = usePersistenceContext();
    const errorDialog = useErrorDialog();
    const log = useLogger();

    return React.useCallback(() => {

        async function doAsync() {

            const selected = selectedProvider();
            const repoDocInfo = Arrays.first(selected);

            if (repoDocInfo) {

                const persistenceLayer = persistenceLayerProvider();
                const docMeta = await persistenceLayer.getDocMeta(repoDocInfo.docInfo.fingerprint);

                if (! docMeta) {

                    errorDialog({
                        title: "No document metadata for document",
                        subtitle: "Could not find any document metadata for document."
                    });

                    return;

                }

                const json = JSON.stringify(docMeta, null, "  ");

                const blob = new Blob([json], {type: "text/json"});
                FileSavers.saveAs(blob, repoDocInfo.docInfo.fingerprint + ".json");

            }

        }

        doAsync().catch(err => log.error(err));

    }, [selectedProvider, errorDialog, persistenceLayerProvider]);

}

export const MUIDocDropdownMenuItems = React.memo(React.forwardRef((props: IProps, ref) => {

    const callbacks = useDocRepoCallbacks();

    const selected = callbacks.selectedProvider();

    const documentDownloadHandler = useDocumentDownloadHandler();
    const jsonDownloadHandler = useJSONDownloadHandler();

    // if (selected.length === 0) {
    //     // there's nothing to render now...
    //     return null;
    // }

    const isSingle = selected.length === 1;

    const single = selected.length === 1 ? selected[0] : undefined;

    function handleDownloadDocument() {
        const repoDocInfo = Arrays.first(selected);
    }

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

            <MenuItem onClick={documentDownloadHandler}>
                <ListItemIcon>
                    <SaveAltIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Download Document"/>
            </MenuItem>

            <MenuItem onClick={jsonDownloadHandler}>
                <ListItemIcon>
                    <FADatabaseIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Download Document Metadata"/>
            </MenuItem>

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
