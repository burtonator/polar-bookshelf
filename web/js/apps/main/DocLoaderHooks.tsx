import React from 'react';
import {LoadDocRequest} from "./doc_loaders/LoadDocRequest";
import {usePersistenceLayerContext} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {
    TabDescriptor,
    useBrowserTabsCallbacks
} from "../../chrome_tabs/BrowserTabsStore";
import {ViewerURLs} from "./doc_loaders/ViewerURLs";
import {PersistentRoute} from "../repository/PersistentRoute";
import {useBrowserDocLoader} from './doc_loaders/browser/BrowserDocLoader';
import {RepositoryDocViewerScreen} from '../repository/RepositoryApp';
import {usePrefs} from "../../../../apps/repository/js/persistence_layer/PrefsHook";


function useDocLoaderElectron2() {

    // const {persistenceLayerProvider} = usePersistenceLayerContext();

    // TODO: this is the problem.  For some reason the callbacks are different
    // each time
    const {addTab} = useBrowserTabsCallbacks();

    return useDocLoaderNull();
}

function useDocLoaderElectron() {

    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const {addTab} = useBrowserTabsCallbacks();

    return React.useCallback((loadDocRequest: LoadDocRequest) => {

        const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
        const parsedURL = new URL(viewerURL);
        const path = parsedURL.pathname;

        return {

            async load(): Promise<void> {

// Commented out for now since TabDescriptor doesn't have component and addTab won't work
/*
                const tabDescriptor: TabDescriptor = {
                    url: path,
                    title: loadDocRequest.title,


                    component: (
                        <PersistentRoute exact path={path}>
                            <RepositoryDocViewerScreen persistenceLayerProvider={persistenceLayerProvider}/>
                        </PersistentRoute>
                    )
                }

                addTab(tabDescriptor);
*/

            }

        };

    }, []);

}

function useDocLoaderDefault() {
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const {addTab} = useBrowserTabsCallbacks();

    const tabbedDocLoader = React.useCallback((loadDocRequest: LoadDocRequest) => {

        const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
        const parsedURL = new URL(viewerURL);
        const path = parsedURL.pathname;
        const tabDescriptor: TabDescriptor = {
            url: path,
            title: loadDocRequest.title,
            tabContentIndex: 0
        }

        addTab(tabDescriptor);

    }, []);

    // usePrefs to get if tabbed browsing is enabled
    // Use this to determine which doc loader to use
    const prefs = usePrefs();

    const browserDocLoader = useBrowserDocLoader();

    if (!prefs.value) {
      return browserDocLoader;
    }

    const tabbed = prefs.value.get('tabbed');
    if (!tabbed.isPresent() || tabbed.get() === "false") {
      return browserDocLoader;
    }

    return tabbedDocLoader;
}

function useDocLoaderNull() {

    return (loadDocRequest: LoadDocRequest) => {

        return {

            async load(): Promise<void> {
                console.log("Used null DocLoader")
            }

        };

    }

}

// There is a performance issue with React / electron where if we have a function
// that returns a different implementation each time it's super slow.
//
// This will ALSO break the rule to only call hooks at the top level and not
// conditionally.
// export const useDocLoader = AppRuntime.isElectron() ? useDocLoaderElectron : useDocLoaderDefault;

export const useDocLoader = useDocLoaderDefault;
