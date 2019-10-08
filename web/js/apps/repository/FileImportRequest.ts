import {AddFileRequest} from "./AddFileRequest";

export interface FileImportRequest {

    /**
     * The array of files to import.
     */
    readonly files: AddFileRequest[];

}
