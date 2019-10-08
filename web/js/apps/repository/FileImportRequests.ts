import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {FileImportRequest} from './FileImportRequest';
import {AddFileRequests} from './AddFileRequests';

export class FileImportRequests {

    public static fromPath(path: string): FileImportRequest {

        return {
            files: [
                AddFileRequests.fromPath(path)
            ]
        };

    }

    public static fromPaths(paths: string[]): FileImportRequest {

        const files = paths.map(path => AddFileRequests.fromPath(path));

        return {
            files
        };

    }

    public static fromURLs(urls: string[]): FileImportRequest {

        const files = urls.map(url => AddFileRequests.fromURL(url));

        return {
            files
        };

    }

}
