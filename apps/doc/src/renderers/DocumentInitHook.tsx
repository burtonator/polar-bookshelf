import React from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useDocViewerJumpToPageLoader, useDocViewerPageJumpListener} from "../DocViewerAnnotationHook";
import {ReadingProgressResume} from "../../../../web/js/view/ReadingProgressResume";
import {useDocViewerStore} from "../DocViewerStore";
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import useReadingProgressResume = ReadingProgressResume.useReadingProgressResume;
import {AnnotationLinks} from '../../../../web/js/annotation_sidebar/AnnotationLinks';
import {useDocRoute} from '../../../../web/js/apps/repository/PersistentRoute';
import {IDocMeta} from 'polar-shared/src/metadata/IDocMeta';

/**
 * Uses all the requirements we need including pagemark resume, jump via anchor
 * resume, etc.
 */
export function useDocumentInit() {

    const location = useLocation();
    const {pageNavigator, docMeta} = useDocViewerStore(['pageNavigator', 'docMeta']);
    const jumpToPageLoader = useDocViewerJumpToPageLoader();
    const [resumeProgressActive, resumeProgressHandler] = useReadingProgressResume();

    const doInit = React.useCallback(() => {
        const hash = AnnotationLinks.parse(location.hash);

        if (hash && hash.page) {
            throw new Error("Annotation hash already exists");
        }

        if (! pageNavigator) {
            throw new Error("No pageNavigator");
        }

        if (! docMeta) {
            throw new Error("No docMeta");
        }

        if (resumeProgressActive) {
            console.log("DocumentInit: Resuming reading progress via pagemarks");
            resumeProgressHandler();
        } else {

            // TODO: this is probably a bug and we shouldn't reference
            // document.location here I think.
            if (jumpToPageLoader(document.location, 'init')) {
                console.log("DocumentInit: Jumped to page via page param.")
            }

        }

        // TODO we aren't doing this right now because the EPUB viewer must
        // go to page 1 first... we can refactor this later once 2.0 is out.
        // pageNavigator.set(1);

        return undefined;

    }, [docMeta, jumpToPageLoader, pageNavigator, resumeProgressActive, resumeProgressHandler]);

    useComponentDidMount(() => {
        setTimeout(doInit, 1);
    })

}

interface IProps {
    docMeta: IDocMeta
}

export default React.memo<IProps>(function DocumentInit({ docMeta }) {
    const {active: routeActive} = useDocRoute();
    useDocViewerPageJumpListener(routeActive);
    useDocumentInit();
    return routeActive ? (
        <Helmet>
            <title>Polar: { docMeta.docInfo.title || '' }</title>
        </Helmet>
    ) : null;
});
