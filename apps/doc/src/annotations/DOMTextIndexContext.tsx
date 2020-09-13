import React from "react";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {DOMTextIndex} from "polar-dom-text-search/src/DOMTextIndex";
import { useDocViewerStore } from "../DocViewerStore";
import {useEPUBDocumentStore} from "../renderers/epub/EPUBDocumentStore";
import { DOMTextIndexes } from "polar-dom-text-search/src/DOMTextIndexes";

interface IDOMTextIndexContent {
    readonly page: number;
    readonly renderIter: number;
    readonly index: DOMTextIndex;
}

const DOMTextIndexContext = React.createContext<IDOMTextIndexContent | undefined>(undefined);

/**
 * Get the DOMTextIndex for the current page.
 */
export function useDOMTextIndexContext(): IDOMTextIndexContent | undefined {
    return React.useContext(DOMTextIndexContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

namespace DOMTextIndexContentCache {

    export function create(page: number,
                           renderIter: number,
                           docViewerElement: HTMLElement): IDOMTextIndexContent | undefined {

        // TODO: make this into an EPUBDocumentElementsContext
        const iframe = docViewerElement.querySelector('iframe');

        if (! iframe) {
            console.warn("DOMTextIndexContentCache: No iframe");
            return undefined;
        }
        const doc = iframe.contentDocument!;
        const root = doc.body;

        const index = DOMTextIndexes.create(doc, root);

        return {page, renderIter, index};

    }

}

export const DOMTextIndexProvider = React.memo((props: IProps) => {

    const docViewerElementsContext = useDocViewerElementsContext();
    const {page} = useDocViewerStore(['page']);
    const {renderIter} = useEPUBDocumentStore(['renderIter'])
    const [index, setIndex] = React.useState<IDOMTextIndexContent | undefined>()

    function cacheExpired() {
        return index === undefined || index.renderIter !== renderIter || index.page !== page;
    }

    if (cacheExpired()) {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        const index = DOMTextIndexContentCache.create(page, renderIter, docViewerElement);
        setIndex(index);
        return null;
    }

    return (
        <DOMTextIndexContext.Provider value={index}>
            {props.children}
        </DOMTextIndexContext.Provider>
    );

});
