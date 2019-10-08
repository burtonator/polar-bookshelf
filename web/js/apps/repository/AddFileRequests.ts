import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {AddFileRequest} from './AddFileRequest';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {AppRuntime} from '../../AppRuntime';
import {ProgressToasters} from '../../ui/progress_toaster/ProgressToasters';
import {Aborters, Files} from 'polar-shared/src/util/Files';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {PathStr} from "polar-shared/src/util/Strings";

const TOASTER_DESTROY_DELAY = 500;
const MAX_RECURSIVE_DIRECTORY_SCAN_DURATION = "30s";

export class AddFileRequests {

    public static fromURL(url: string): AddFileRequest {

        const toBasename = (input: string): string => {
            input = input.replace( /[?#].*$/, '');
            return FilePaths.basename(input);
        };

        // compute a sane basename

        const parsedURL = new URL(url);

        const basenames = [];

        if (parsedURL.searchParams.get('url')) {
            basenames.push(toBasename(parsedURL.searchParams.get('url')!));
        }

        basenames.push(toBasename(url));

        const basename =
            basenames.filter(current => isPresent(current))
                     .reduce(Reducers.FIRST);

        return {
            docPath: url,
            basename
        };

    }

    public static fromPath(path: string): AddFileRequest {

        return {
            docPath: path,
            basename: FilePaths.basename(path)
        };

    }

    public static computeDirectly(event: DragEvent): AddFileRequest[] {

        if (event.dataTransfer && event.dataTransfer.files) {

            return this.computeFromFileList(event.dataTransfer.files);

        } else {
            return [];
        }

    }

    public static computeFromFileList(files: FileList): AddFileRequest[] {

        return Array.from(files)
            .filter(file => FilePaths.hasExtension(file.name, 'pdf'))
            .map(file => {

                if (file.path) {

                    // On Electron we have the file path directly.
                    return {
                        docPath: file.path,
                        basename: FilePaths.basename(file.path)
                    };

                } else {

                    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

                    return {
                        docPath: URL.createObjectURL(file),
                        basename: file.name,
                    };
                }

            });

    }

    /**
     * @ElectronRendererContext
     * @BrowserContext
     * @param event
     */
    public static async computeRecursively(event: DragEvent): Promise<Optional<AddFileRequest[]>> {

        if (AppRuntime.isElectron()) {

            if (event.dataTransfer) {

                // TODO: I don't like embedding the UI component in here
                // directly...

                const progressToaster = await ProgressToasters.create();

                try {

                    // the aborter will just throw an exception if the timeout
                    // exceeds and the caller should show an error.
                    const aborter = Aborters.maxTime(MAX_RECURSIVE_DIRECTORY_SCAN_DURATION);

                    const paths = Array.from(event.dataTransfer.files)
                        .map(file => file.path);

                    const acceptedFiles: PathStr[] = [];

                    for (const path of paths) {

                        if (await Files.fileType(path) === 'directory') {

                            await Files.recursively(path, async newPath => {

                                if (newPath.toLocaleLowerCase().endsWith(".pdf")) {
                                    acceptedFiles.push(newPath);
                                }

                                progressToaster.update({
                                    title: `Finding files (${acceptedFiles.length}): `,
                                    status: newPath
                                });

                            }, aborter);

                        }

                    }

                    const addFileRequests =
                        acceptedFiles.map(current => {
                            return {
                                docPath: current,
                                basename: FilePaths.basename(current)
                            };
                        });

                    return Optional.of(addFileRequests);

                } finally {

                    setTimeout(() => progressToaster.destroy(), TOASTER_DESTROY_DELAY);

                }

            }

        }

        return Optional.empty();

    }

}

