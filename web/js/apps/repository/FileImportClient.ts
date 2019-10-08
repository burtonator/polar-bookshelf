import {ipcRenderer} from "electron";
import {Broadcasters} from "../../ipc/Broadcasters";
import {FileImportRequest} from "./FileImportRequest";

/**
 * Code to send message to the FileImportController on the channel it expects.
 *
 */
export class FileImportClient {

    public static send(fileImportRequest: FileImportRequest) {

        Broadcasters.send('file-import', fileImportRequest);

    }

}
