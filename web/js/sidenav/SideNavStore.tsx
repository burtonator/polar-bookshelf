import React from 'react';
import {Provider} from 'polar-shared/src/util/Providers';
import {createObservableStore, SetStore} from '../react/store/ObservableStore';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import { useHistory } from 'react-router-dom';
import { Arrays } from 'polar-shared/src/util/Arrays';
import {useRefValue} from '../hooks/ReactHooks';
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";

export const SIDE_NAV_ENABLED = 'true';

export type TabID = IDStr;

export interface ITabImage {
    readonly url: string;
    readonly width: number;
    readonly height: number;
}

export type TabContentType = 'pdf' | 'epub';

export interface TabDescriptorInit {

    /**
     * The tab ID is globally unique and never changes.
     */
    readonly id: TabID;

    /**
     * The URL for this tab so that the router can be used with it.
     */
    readonly url: URLStr;

    /**
     * The URL hash that should be used to load the tab's document page.
     */
    readonly hash?: string;

    /**
     * The title for the tab
     */
    readonly title: string;

    /**
     * An icon to show for this tab
     */
    readonly icon?: React.ReactNode;

    readonly image?: ITabImage;

    readonly type: TabContentType;

}

export interface TabDescriptor extends TabDescriptorInit {

    readonly created: ISODateTimeString;

    /**
     * Used so that if we switch to a tab, or close a tab, we immediately switch
     * to the previously used tab.
     */
    readonly lastActivated: ISODateTimeString;

    /**
     * The URL that is currently 'active' vs the original URL which is only updated once.
     */
    readonly activeURL: URLStr;

}

/**
 * Fields that we're allowed to update in a tab.
 */
interface TabDescriptorUpdate {
    readonly activeURL: URLStr;
    readonly title?: string;
}

interface ISideNavStore {

    readonly activeTab: TabID | undefined;

    readonly tabs: ReadonlyArray<TabDescriptor>;

}

interface ISideNavCallbacks {

    readonly setActiveTab: (id: TabID) => void;
    readonly addTab: (tabDescriptor: TabDescriptorInit) => void;
    readonly removeTab: (id: TabID) => void;
    readonly closeCurrentTab: () => void;
    readonly closeOtherTabs: (anchor: TabID) => void;
    readonly prevTab: () => void;
    readonly nextTab: () => void;
    readonly getTabDescriptor: (id: TabID) => TabDescriptor | undefined;

    readonly updateTab: (id: TabID, update: TabDescriptorUpdate) => void;

    readonly updateTabForPredicate: (update: TabDescriptorUpdate,
                                     predicate: (tab: TabDescriptor) => boolean) => void;

}

function createInitialTabs(): ReadonlyArray<TabDescriptor> {
    return [
    ]
}

const initialStore: ISideNavStore = {
    activeTab: undefined,
    tabs: createInitialTabs(),
}

interface Mutation {
    readonly activeTab: TabID;
    readonly tabs: ReadonlyArray<TabDescriptor>;
}

interface Mutator {

    readonly doUpdate: (mutation: Mutation) => void;

}

function mutatorFactory(storeProvider: Provider<ISideNavStore>,
                        setStore: SetStore<ISideNavStore>): Mutator {

    function doUpdate(mutation: Mutation) {
        setStore(mutation);
    }

    return {doUpdate};

}

function useCallbacksFactory(storeProvider: Provider<ISideNavStore>,
                             setStore: (store: ISideNavStore) => void,
                             mutator: Mutator): ISideNavCallbacks {

    const history = useHistory();
    const historyRef = useRefValue(history);

    return React.useMemo((): ISideNavCallbacks => {

        function tabByID(id: TabID) {
            const store = storeProvider();
            return Arrays.first(store.tabs.filter(tab => tab.id === id));
        }

        function updateTabForPredicate(update: TabDescriptorUpdate,
                                       predicate: (tab: TabDescriptor) => boolean) {

            const store = storeProvider();

            const tabs = [...store.tabs];
            const matching = tabs.filter(predicate);

            for (const tab of matching) {

                const tabIndex = computeTabIndex(tabs, tab.id);

                if (tabIndex !== undefined) {

                    const newTab = {
                        ...tab,
                        ...update
                    };

                    tabs[tabIndex] = newTab;

                }

            }

            setStore({...store, tabs});

        }

        function computeTabIndex(tabs: ReadonlyArray<TabDescriptor>, id: TabID) {

            return arrayStream(tabs)
                .map((current, idx) => current.id === id ? idx : undefined)
                .filter(current => current !== undefined)
                .first();
        }

        function updateTab(id: TabID, update: TabDescriptorUpdate) {

            const store = storeProvider();
            const tabs = [...store.tabs];
            const tab = tabByID(id);

            const tabIndex = computeTabIndex(tabs, id);

            if (tabIndex !== undefined && tab) {

                const newTab = {
                    ...tab,
                    ...update
                };

                tabs[tabIndex] = newTab;

            }

            setStore({...store, tabs});

        }

        function setActiveTab(activeTabID: TabID) {
            const store = storeProvider();
            const lastActivated = ISODateTimeStrings.create();

            const tabs = [...store.tabs];

            // TODO: this won't actively work if this was the last tab I
            // selected, and we jump back to the other tabs since the activeTab
            // doesn't get set to undefined.

            // if (store.activeTab === activeTabID) {
            //     // we're already on this ID
            //     return;
            // }

            const activeTab = tabByID(activeTabID);

            const tabIndex = Arrays.first(tabs.map((current, idx) => current.id === activeTabID ? idx : undefined))

            if (tabIndex !== undefined && activeTab) {

                tabs[tabIndex] = {
                    ...activeTab,
                    lastActivated
                }

            }

            setStore({...store, tabs, activeTab: activeTabID});

            if (activeTab) {
                historyRef.current.push(activeTab.activeURL);
            }

        }

        function addTab(newTabDescriptor: TabDescriptorInit) {

            const now = ISODateTimeStrings.create();

            const tabDescriptor: TabDescriptor = {
                ...newTabDescriptor,
                activeURL: newTabDescriptor.url,
                created: now,
                lastActivated: now,
            }

            const store = storeProvider();

            function computeExistingTab() {
                return arrayStream(store.tabs)
                    .withIndex()
                    .filter(current => current.value.url === tabDescriptor.url)
                    .first();
            }

            const existingTab = computeExistingTab();

            if (existingTab) {
                // just switch to the existing tab when one already exists and we
                // want to switch to it again.
                setStore({...store, activeTab: existingTab.value.id});
                historyRef.current.push(tabDescriptor.url);
                return;
            }

            const tabs = [...store.tabs, tabDescriptor];

            // now switch to the new tab
            const activeTab = tabDescriptor.id;

            setStore({...store, tabs, activeTab});
            const hash = newTabDescriptor.hash ? `#${newTabDescriptor.hash}` : '';
            historyRef.current.push(`${tabDescriptor.url}${hash}`);
        }

        function removeTab(id: TabID) {

            const store = storeProvider();

            function computeNewTabs() {
                return store.tabs.filter(current => current.id !== id)
            }

            const tabs = computeNewTabs();
            // const activeTab = computeActiveTab();

            historyRef.current.push("/");
            setStore({...store, tabs, activeTab: undefined});


        }

        function closeOtherTabs(anchor: TabID) {

            const store = storeProvider();

            const tabs = store.tabs.filter(current => current.id === anchor);

            setStore({...store, tabs, activeTab: anchor});

        }

        function closeCurrentTab() {

            console.log("Closing current tab");

            const store = storeProvider();

            if (store.activeTab !== undefined) {
                removeTab(store.activeTab);
            }

        }

        function doNav(direction: 'prev' | 'next') {

            const store = storeProvider();

            // TODO: it's not undefined if we change the URL...
            if (store.activeTab === undefined) {

                if (store.tabs.length > 0) {

                    switch (direction) {

                        case "prev":
                            setActiveTab(Arrays.last(store.tabs)!.id);
                            break;
                        case "next":
                            setActiveTab(Arrays.first(store.tabs)!.id);
                            break;

                    }

                }

                // nothing currently selected
                return;
            }

            function computeNextTab(): TabDescriptor | undefined {

                const currentTab = Arrays.first(store.tabs.filter(current => current.id === store.activeTab));

                if (! currentTab) {
                    return undefined;
                }

                const idx = store.tabs.indexOf(currentTab);

                switch(direction) {

                    case "prev":
                        return Arrays.prevSibling(store.tabs, idx);

                    case "next":
                        return Arrays.nextSibling(store.tabs, idx);

                }

            }

            const nextTab = computeNextTab();

            if (nextTab) {
                setActiveTab(nextTab.id);
            }

        }

        function prevTab() {
            doNav('prev');
        }

        function nextTab() {
            doNav('next');
        }

        function getTabDescriptor(id: TabID) {
            const store = storeProvider();

            return Arrays.first(store.tabs.filter(current => current.id === id));

        }

        return {
            addTab, removeTab, setActiveTab, closeCurrentTab, prevTab,
            nextTab, closeOtherTabs, getTabDescriptor, updateTab, updateTabForPredicate
        };

    }, [historyRef, setStore, storeProvider]);

}

export interface ISideNavHistory {
    readonly push: (url: URLStr) => void;
}

export function useSideNavHistory(): ISideNavHistory {

    const history = useHistory();
    const {updateTabForPredicate} = useSideNavCallbacks();

    const push = React.useCallback((url: URLStr) => {

        // const source = DocViewerAppURLs.parse(document.location.href);
        const target = DocViewerAppURLs.parse(url);

        history.push(url);

        const update: TabDescriptorUpdate = {activeURL: url};

        updateTabForPredicate(update, current => DocViewerAppURLs.parse(current.url)?.id === target?.id);

    }, [history, updateTabForPredicate]);

    if (SIDE_NAV_ENABLED) {
        return {push};
    } else {
        return history;
    }


}

export function createSideNavStore() {

    return createObservableStore<ISideNavStore, Mutator, ISideNavCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });

}

export const [SideNavStoreProvider, useSideNavStore, useSideNavCallbacks]
    = createSideNavStore();
