import {usePersistenceLayerContext} from "../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocMigration} from "../DocMigration";
import React from "react";
import {ViewerURLs} from "../ViewerURLs";
import {TabContentType, useSideNavCallbacks} from "../../../../sidenav/SideNavStore";
import {LoadDocRequest} from "../LoadDocRequest";

function computeTabContentType(loadDocRequest: LoadDocRequest): TabContentType {

    const name = loadDocRequest.backendFileRef.name.toLowerCase();

    if (name.endsWith('.pdf')) {
        return 'pdf';
    }

    if (name.endsWith('.epub')) {
        return 'epub';
    }

    throw new Error("Unable to determine content type: " + name);

}

export function useSideNavDocLoader() {

    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const docMigration = useDocMigration();
    const {addTab} = useSideNavCallbacks();

    return React.useCallback((loadDocRequest: LoadDocRequest) => {

        if (! docMigration(loadDocRequest)) {

            const type = computeTabContentType(loadDocRequest);

            const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);

            const url = viewerURL.replace("http://localhost:8050", "")
                                 .replace("https://localapp.getpolarized.io", "");

            addTab({
                id: loadDocRequest.fingerprint,
                url,
                title: loadDocRequest.title,
                type,
                initialUrl: loadDocRequest.initialUrl,
            })

        }

    }, [addTab, docMigration, persistenceLayerProvider]);

}
