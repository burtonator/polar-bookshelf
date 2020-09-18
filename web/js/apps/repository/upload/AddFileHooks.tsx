import React from 'react';
import {DocImporter, ImportedFile} from "../importers/DocImporter";
import {useLogger} from "../../../mui/MUILogger";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DeterminateProgressBar} from "../../../ui/progress_bar/DeterminateProgressBar";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {WriteFileProgressListener} from "../../../datastore/Datastore";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {useDocLoader} from "../../main/DocLoaderHooks";
import IconButton from '@material-ui/core/IconButton';
import {BackendFileRefs} from "../../../datastore/BackendFileRefs";
import {Either} from "../../../util/Either";
import LaunchIcon from '@material-ui/icons/Launch';
import {Strings} from "polar-shared/src/util/Strings";
import {AddContentButtons} from "../../../../../apps/repository/js/ui/AddContentButtons";

export namespace AddFileHooks {

    import useAccountVerifiedAction = AddContentButtons.useAccountVerifiedAction;

    export function useAddFileImporter() {

        const log = useLogger();
        const {persistenceLayerProvider} = usePersistenceLayerContext()
        const dialogManager = useDialogManager();
        const docLoader = useDocLoader();
        const accountVerifiedAction = useAccountVerifiedAction()

        async function doImportFiles(files: ReadonlyArray<File>): Promise<ReadonlyArray<ImportedFile>> {

            async function doFile(idx: number, file: File) {

                console.log("Importing file: ", file);

                const updateProgress =
                    await dialogManager.taskbar({message: `Uploading file ${idx} of ${files.length} file(s)`});

                updateProgress({value: 'indeterminate'});

                try {

                    const progressListener: WriteFileProgressListener = (progress) => {

                        switch (progress.type) {
                            case 'determinate':
                                updateProgress({value: progress.value});
                                break;
                            case 'indeterminate':
                                updateProgress({value: 'indeterminate'});
                                break;
                        }

                    };

                    const importedFile = await DocImporter.importFile(persistenceLayerProvider,
                                                                      URL.createObjectURL(file),
                                                                      FilePaths.basename(file.name),
                                                                      {progressListener});

                    log.info("Imported file: ", importedFile);

                    result.push(importedFile);

                } catch (e) {
                    log.error("Failed to import file: ", e, file);
                } finally {

                    updateProgress({value: 100});

                    const progress = progressTracker.terminate();
                    // TODO this should be deprecated...
                    DeterminateProgressBar.update(progress);

                }

            }

            const progressTracker = new ProgressTracker({total: files.length, id: 'import-files'});

            const result: ImportedFile[] = [];

            try {

                let idx = 0;

                for (const file of files) {
                    ++idx;
                    await doFile(idx, file);
                }

                return result;

            } finally {
                // noop
            }

        }

        function promptToOpenFiles(importedFiles: ReadonlyArray<ImportedFile>) {

            function createSnackbar(importedFile: ImportedFile) {

                const title = Strings.truncate(importedFile.docInfo.title || 'Untitled', 20);
                const {docInfo} = importedFile;

                function doOpenDoc() {

                    const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

                    const docLoadRequest = {
                        fingerprint: docInfo.fingerprint,
                        title,
                        backendFileRef,
                        newWindow: true
                    };

                    docLoader(docLoadRequest)
                }

                const Action = () => (
                    <IconButton size="small"
                                color="secondary"
                                onClick={doOpenDoc}>
                        <LaunchIcon/>
                    </IconButton>
                );

                dialogManager.snackbar({
                    message: `Would you like to open '${title}' now?`,
                    type: 'success',
                    action: <Action/>
                });

            }

            if (importedFiles.length === 1) {
                const importedFile = importedFiles[0];
                createSnackbar(importedFile);
            }

        }

        async function doExec(files: ReadonlyArray<File>) {

            if (files.length > 0) {

                async function doAsync() {

                    try {
                        const importedFiles = await doImportFiles(files);
                        promptToOpenFiles(importedFiles);
                    } catch (e) {
                        log.error("Unable to import files: ", files, e);
                    }

                }

                accountVerifiedAction(() => doAsync().catch(err => log.error(err)))


            } else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }

        }

        return (files: ReadonlyArray<File>) => {

            // we have to do three main things here:

            if (! files || files.length === 0) {
                log.warn("No dataTransfer files");
            }

            doExec(files)
                .catch(err => log.error("Unable to handle upload: ", err));

        }


    }


}
