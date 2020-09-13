import React from 'react';
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import {ProgressDialog} from "./ProgressDialog";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

export interface UploadProgressDialogProps {
    readonly value: Percentage | 'indeterminate';
}

export const UploadProgressDialog = (props: UploadProgressDialogProps) => {

    return (
        <ProgressDialog title="Just a few seconds"
                        description="You file is uploading right now. Just give us a second to finish up."
                        value={props.value}
                        icon={<CloudUploadIcon fontSize="large"
                                               color="primary"/>}/>
    );
};
