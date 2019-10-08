import {JSONRPC} from './JSONRPC';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {FileRef} from "polar-shared/src/datastore/FileRef";

export class DatastoreImportFiles {

    public static async exec(request: DatastoreImportFileRequest): Promise<void> {
        return await JSONRPC.exec('datastoreImportFile', request);
    }

}

interface DatastoreImportFileRequest {
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}
