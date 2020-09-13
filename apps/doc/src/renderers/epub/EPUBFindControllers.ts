import React from 'react';
import {Finder, FindHandler, IFindOpts} from "../../Finders";
import {DOMTextHitWithIndex, useEPUBFinderCallbacks} from "./EPUBFinderStore";
import {useHistory} from "react-router-dom";
import {EPUBFinders, useEPUBRootProvider} from "./EPUBFinders";
import {URLStr} from 'polar-shared/src/util/Strings';
import {Provider} from 'polar-shared/src/util/Providers';
import {useJumpToAnnotationHandler} from "../../../../../web/js/annotation_sidebar/JumpToAnnotationHook";
import {IAnnotationPtr} from "../../../../../web/js/annotation_sidebar/AnnotationLinks";
import {useDocViewerContext} from "../DocRenderer";
import {useDocViewerStore} from '../../DocViewerStore';
import EPUBFinder = EPUBFinders.EPUBFinder;

export namespace EPUBFindControllers {

    export function useEPUBFindController(): Finder {

        const history = useHistory();
        const callbacks = useEPUBFinderCallbacks();
        const epubFinderCacheProvider = useEPUBFinderCache();
        const jumpToAnnotationHandler = useJumpToAnnotationHandler();
        const {docID} = useDocViewerContext();
        const {page} = useDocViewerStore(['page']);
        // this is a big of a hack because the hooks aren't getting rebuilt and
        // updated for the caller.
        const pageRef = React.useRef(page);
        pageRef.current = page;

        const exec = (opts: IFindOpts): FindHandler => {

            const cancel = () => {
                history.replace({hash: ""});
                // cancel the hits we're working with.
                callbacks.reset();
            };

            function updateHit(hit: DOMTextHitWithIndex | undefined) {

                if (! hit) {
                    return;
                }

                function scrollTo() {

                    const ptr: IAnnotationPtr = {
                        target: hit!.id,
                        docID,
                        pageNum: pageRef.current
                    }

                    jumpToAnnotationHandler(ptr);

                }

                function updateMatches() {
                    opts.onMatches({total: hits.length, current: hit!.idx + 1});
                }

                scrollTo();
                updateMatches();

            }

            function next() {
                updateHit(callbacks.next());
            }

            function prev() {
                updateHit(callbacks.prev());
            }

            const finder = epubFinderCacheProvider();

            // TODO: I think this should/could go into the store
            const hits = finder.exec({
                query: opts.query,
                caseInsensitive: true
            });

            callbacks.setHits(hits);
            next();
            opts.onMatches({total: hits.length, current: hits.length > 0 ? 1 : 0});

            return {opts, cancel, next, prev};

        };

        return {exec};

    }
}

interface EPUBFinderCacheEntry {
    readonly location: string;
    readonly finder: EPUBFinder;
    readonly pageNum: number;
}

export function useEPUBFinderCache(): Provider<EPUBFinder> {

    const cacheRef = React.useRef<EPUBFinderCacheEntry | undefined>();
    const epubRootProvider = useEPUBRootProvider();
    const {page} = useDocViewerStore(['page']);

    const getLocation = React.useCallback((): URLStr => {
        const {root} = epubRootProvider();
        return root.ownerDocument!.location.href;
    }, [epubRootProvider]);

    return React.useCallback((): EPUBFinder => {

        if (cacheRef.current?.location !== getLocation()) {

            const location = getLocation();
            const finder = EPUBFinders.create(epubRootProvider);
            cacheRef.current = {
                location, finder, pageNum: page
            }

        }

        return cacheRef.current.finder;

    }, [epubRootProvider, getLocation, page])

}
