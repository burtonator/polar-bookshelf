import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import {DOMTextIndexes} from "polar-dom-text-search/src/DOMTextIndexes";
import {Provider} from "polar-shared/src/util/Providers";

export namespace EPUBFinders {

    interface Opts {
        readonly query: string;
        readonly caseInsensitive?: boolean;
    }

    export interface EPUBFinder {
        readonly exec: (opts: Opts) => ReadonlyArray<DOMTextHit>
    }

    export function create(epubRootProvider: Provider<EPUBRoot>): EPUBFinder {

        const index = createIndex(epubRootProvider);

        function exec(opts: Opts) {

            const {query} = opts;

            if (query.trim() === '') {
                return [];
            }

            return index.search(query, 0, {caseInsensitive: opts.caseInsensitive});

        }

        return {exec};

    }

    function createIndex(epubRootProvider: Provider<EPUBRoot>) {

        const {doc, root} = epubRootProvider();
        return DOMTextIndexes.create(doc, root);

    }

}

export interface EPUBRoot {
    readonly doc: Document;
    readonly root: HTMLElement;
}

export function useEPUBRootProvider(): Provider<EPUBRoot> {

    const docViewerElementsContext = useDocViewerElementsContext();

    return (): EPUBRoot => {

        const docViewerElement = docViewerElementsContext.getDocViewerElement();

        const iframe = docViewerElement.querySelector('iframe');

        if (! iframe) {
            throw new Error("No iframe - epub probably not mounted yet");
        }

        if (! iframe.contentDocument) {
            throw new Error("No iframe contentDocument - epub probably not mounted yet");
        }

        const doc = iframe!.contentDocument!;
        const root = doc.body;

        return {doc, root};

    };

}

/**
 * Like useEPUBRootProvider but is not late bound.
 */
export function useEPUBRoot(): EPUBRoot {

    const provider = useEPUBRootProvider();
    return provider();

}
