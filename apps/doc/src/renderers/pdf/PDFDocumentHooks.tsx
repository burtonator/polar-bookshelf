import React from 'react';
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";

export function usePDFScrollListener(onScroll: () => void) {

    const docViewerElementsContext = useDocViewerElementsContext();
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    const containerElement = docViewerElement.querySelector('#viewerContainer')! as HTMLDivElement;

    useComponentDidMount(() => {

        containerElement.addEventListener('scroll', () => {
            onScroll();
        });

    })

}
