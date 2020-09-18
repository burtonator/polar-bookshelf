import React from 'react';
import {LoadDocRequest} from "./LoadDocRequest";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useNav} from "../../../ui/util/NavHook";

export type DocMigrationHandler = (loadDocRequest: LoadDocRequest) => boolean;

export function useDocMigration(): DocMigrationHandler {

    const dialogs = useDialogManager();
    const linkLoader = useNav();

    const onAccept = React.useCallback((loadDocRequest: LoadDocRequest) => {

        const params = {
            url: encodeURIComponent(loadDocRequest.url!),
            docID: loadDocRequest.fingerprint
        };

        const url = `https://beta.getpolarized.io/migration/phz?docID=${params.docID}&url=${params.url}`;

        linkLoader(url, {newWindow: true, focus: true});

    }, [linkLoader]);

    return React.useCallback((loadDocRequest) => {
        const {backendFileRef} = loadDocRequest;

        const fileName = backendFileRef.name;

        if (FilePaths.hasExtension(fileName, "phz")) {

            dialogs.confirm({
                title: "This is a legacy document that needs to be migrated",
                acceptText: "Start Migration",
                subtitle: (
                    <div>
                        <p>
                            This is a legacy web capture document which must be
                            migrated to our new document format as part of 2.0.
                        </p>

                        <p>
                            The migration assistant will:
                        </p>

                        <ul>
                            <li>
                                Trigger web capture again to use our new web
                                capture system.
                            </li>
                            <li>
                                Preserve all your existing metadata (title,
                                flagged, archived, etc)
                            </li>
                            <li>
                                Migrate your text highlights, comments, and flashcards.
                            </li>
                        </ul>

                        <p>
                            As part of the migration we are <b>NOT</b> able to
                            preserve pagemarks or area highlights.
                        </p>

                    </div>
                ),
                onAccept: () => onAccept(loadDocRequest)
             });

            return true;
        } else {
            return false;
        }

    }, [dialogs, onAccept])

}
