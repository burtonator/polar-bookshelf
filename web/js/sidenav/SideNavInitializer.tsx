import React from 'react';
import {useLocation} from 'react-router-dom';
import {SIDE_NAV_ENABLED, TabDescriptor, useSideNavStore} from "./SideNavStore"
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";
import {useRepoDocMetaManager} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocLoader} from "../apps/main/DocLoaderHooks";
import {BackendFileRefs} from "../datastore/BackendFileRefs";
import {Either} from "../util/Either";
import {LoadDocRequest} from "../apps/main/doc_loaders/LoadDocRequest";
import {IDStr} from "polar-shared/src/util/Strings";
import {AnnotationPtrs, IAnnotationPtr} from '../annotation_sidebar/AnnotationPtrs';
import {AnnotationLinks} from '../annotation_sidebar/AnnotationLinks';

export function useSideNavInitializer() {

    const {tabs} = useSideNavStore(['tabs']);
    const docLoader = useDocLoader();
    const repoDocMetaManager = useRepoDocMetaManager();
    const location = useLocation();

    // the first docViewerURL based on the initial location.
    const docViewerURL = DocViewerAppURLs.parse(location.pathname)

    const handleDocLoad = React.useCallback((id: IDStr) => {

        if (! SIDE_NAV_ENABLED) {
            return;
        }

        const repoDocInfo = repoDocMetaManager.repoDocInfoIndex.get(id);

        if (repoDocInfo) {

            const fingerprint = repoDocInfo.fingerprint;

            const docInfo = repoDocInfo.docInfo;
            const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

            const parsedHash = AnnotationLinks.parse(location.hash);

            const annotationPtr: IAnnotationPtr | undefined = parsedHash && AnnotationPtrs.create({
                pageNum: parsedHash.page,
                target: parsedHash.target,
                docID: fingerprint
            });

            const docLoadRequest: LoadDocRequest = {
                fingerprint,
                title: repoDocInfo.title,
                url: repoDocInfo.url,
                backendFileRef,
                newWindow: true,
                annotationPtr: annotationPtr,
            };

            docLoader(docLoadRequest);
        }

    }, [location, docLoader, repoDocMetaManager.repoDocInfoIndex])

    React.useEffect(() => {

        function predicate(tab: TabDescriptor) {
            const parsedTabURL = DocViewerAppURLs.parse(tab.url);
            return docViewerURL?.id === parsedTabURL?.id;
        }

        const matchingTabs = tabs.filter(predicate);

        if (matchingTabs.length === 0 && docViewerURL) {
            handleDocLoad(docViewerURL?.id!)
        }

    }, [docViewerURL, docViewerURL?.id, handleDocLoad, tabs])

}

export default React.memo(function SideNavInitializer() {
    useSideNavInitializer();
    return null;
});
