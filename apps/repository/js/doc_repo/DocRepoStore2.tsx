import * as React from "react";
import {RepoDocInfo} from "../RepoDocInfo";
import {Sorting} from "./Sorting";
import {DocRepoFilters2} from "./DocRepoFilters2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {Provider} from "polar-shared/src/util/Providers";
import {Mappers} from "polar-shared/src/util/Mapper";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {DialogManager} from "../../../../web/js/mui/dialogs/MUIDialogController";
import {
    IPersistenceContext,
    usePersistenceContext,
    useRepoDocMetaLoader,
    useRepoDocMetaManager,
    useTagsProvider
} from "../persistence_layer/PersistenceLayerApp";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {Either} from "../../../../web/js/util/Either";
import {Clipboards} from "../../../../web/js/util/system/clipboard/Clipboards";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {
    TagSidebarEventForwarder,
    TagSidebarEventForwarderContext
} from "../store/TagSidebarEventForwarder";
import {SelectionEvents2, SelectRowType} from "./SelectionEvents2";
import {IDStr} from "polar-shared/src/util/Strings";
import {TaggedCallbacks} from "../annotation_repo/TaggedCallbacks";
import {BatchMutators} from "../BatchMutators";
import {ILogger} from "polar-shared/src/logger/ILogger";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {AddFileDropzone} from "../../../../web/js/apps/repository/upload/AddFileDropzone";
import {useDocLoader} from "../../../../web/js/apps/main/DocLoaderHooks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
import TaggedCallbacksOpts = TaggedCallbacks.TaggedCallbacksOpts;
import BatchMutatorOpts = BatchMutators.BatchMutatorOpts;
import {IAsyncTransaction} from "polar-shared/src/util/IAsyncTransaction";
import {useRefWithUpdates} from "../../../../web/js/hooks/ReactHooks";
import {LoadDocRequest} from "../../../../web/js/apps/main/doc_loaders/LoadDocRequest";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {RepoDocInfos} from "../RepoDocInfos";
import TypeConverter = Sorting.TypeConverter;
import {createObservableStoreWithPrefsContext} from "../../../../web/js/react/store/ObservableStoreWithPrefsContext";
import {Analytics} from "../../../../web/js/analytics/Analytics";

interface IDocRepoStore {

    readonly data: ReadonlyArray<RepoDocInfo>;

    /**
     * The sorted view of the data based on the order and orderBy.
     */
    readonly view: ReadonlyArray<RepoDocInfo>;

    /**
     * The selected records as pointers in to viewPage
     */
    readonly selected: ReadonlyArray<IDStr>;

    /**
     * The sorting order.
     */
    readonly order: Sorting.Order,

    /**
     * The column we are sorting by.
     */
    readonly orderBy: keyof IDocInfo;

    readonly filters: DocRepoFilters2.Filter;

    /**
     * Only used to trigger a store refresh.  This is not strictly necessary
     * but might in the future if we want to FORCE a refresh for some reason.
     */
    readonly _refresh: number;

    readonly isLeftDockOpen: boolean;

}

interface IDocRepoCallbacks {

    // *** UI operations that dont actually modify data
    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>;

    readonly selectRow: (viewID: IDStr,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

    readonly setSelected: (selected: ReadonlyArray<IDStr> | 'all' | 'none') => void;
    readonly setFilters: (filters: DocRepoFilters2.Filter) => void;
    readonly setSort: (order: Sorting.Order, orderBy: keyof IDocInfo) => void;

    // *** actual actions that manipulate the backend
    readonly doTagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>,
                        tags: ReadonlyArray<Tag>,
                        strategy: ComputeNewTagsStrategy) => void;

    readonly doOpen: (repoDocInfo: RepoDocInfo) => void;
    readonly doRename: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly doCopyOriginalURL: (repoDocInfo: RepoDocInfo) => void;
    readonly doCopyDocumentID: (repoDocInfo: RepoDocInfo) => void;
    readonly doDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly doArchived: (repoDocInfos: ReadonlyArray<RepoDocInfo>, archived: boolean) => void;
    readonly doFlagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>, flagged: boolean) => void;

    /**
     * Called when we've updated a raw IDocInfo object.
     */
    readonly onUpdated: (repoDocInfo: RepoDocInfo, docInfo: IDocInfo) => void;

    // ** callbacks that might need prompts, confirmation, etc.
    readonly onTagged: () => void;
    readonly onOpen: () => void;
    readonly onRename: () => void;
    readonly onCopyOriginalURL: () => void;
    readonly onCopyDocumentID: () => void;
    readonly onDeleted: () => void;
    readonly onArchived: () => void;
    readonly onFlagged: () => void;

    readonly onDragStart: (event: React.DragEvent) => void;
    readonly onDragEnd: () => void;

    readonly doDropped: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag) => void;

    /**
     * Called when an doc is actually dropped on a tag.
     */
    readonly onDropped: (tag: Tag) => void;

    /**
     * Called when the user is filtering the UI based on a tag and is narrowing
     * down what's displayed by one or more tag.
     */
    readonly onTagSelected: (tags: ReadonlyArray<Tag>) => void;

    readonly setLeftDockOpen: (state: boolean) => void;
}

// the default state of the store...
const initialStore: IDocRepoStore = {
    data: [],
    view: [],
    selected: [],

    orderBy: 'progress',
    order: 'desc',

    filters: {},
    _refresh: 0,
    isLeftDockOpen: false,
}

interface Mutator {
    doReduceAndUpdateState: (newStore: IDocRepoStore) => void;
    setDataProvider: (dataProvider: DataProvider) => void;
    refresh: () => void;
}

type DataProvider = Provider<ReadonlyArray<RepoDocInfo>>;

function mutatorFactory(storeProvider: Provider<IDocRepoStore>,
                        setStore: (store: IDocRepoStore) => void): Mutator {

    let dataProvider: DataProvider = () => [];


    /**
     * Apply a reducer a temporary state, to compute the effective state.
     */
    function reduce(tmpStore: IDocRepoStore): IDocRepoStore {

        // compute the view, then the viewPage

        // TODO: we only have to resort and recompute the view when the filters
        // or the sort order changes.

        const {data, order, orderBy, filters} = tmpStore;

        // Now that we have new data, we have to also apply the filters and sort
        // order to the results, then update the view + viewPage

        const converter: TypeConverter<RepoDocInfo, IDocInfo> = (from) => from.docInfo;

        const view = Mappers.create(data)
            .map(current => DocRepoFilters2.execute(current, filters))
            .map(current => Sorting.stableSort(current, Sorting.createComparator(order, orderBy, converter)))
            .collect()

        return {...tmpStore, view};

    }

    function doReduceAndUpdateState(tmpState: IDocRepoStore) {

        setTimeout(() => {
            const newState = reduce({...tmpState});
            setStore(newState);
        }, 1)

    }

    /**
     * Fetch the latest values from the repoDocMetaManager, then reduce, and
     * apply state.
     */
    function refresh() {
        const store = storeProvider();
        setTimeout(() => {
            const data = dataProvider();
            doReduceAndUpdateState({...store, data});
        }, 1);
    }

    function setDataProvider(newDataProvider: DataProvider) {
        dataProvider = newDataProvider;
    }

    return {
        doReduceAndUpdateState,
        refresh,
        setDataProvider
    };

}

function useCreateCallbacks(storeProvider: Provider<IDocRepoStore>,
                            setStore: (store: IDocRepoStore) => void,
                            mutator: Mutator,
                            repoDocMetaManager: RepoDocMetaManager,
                            tagsProvider: () => ReadonlyArray<Tag>,
                            dialogs: DialogManager,
                            persistence: IPersistenceContext,
                            log: ILogger): IDocRepoCallbacks {

    const docLoader = useDocLoader();

    function firstSelected() {
        const selected = selectedProvider();
        return selected.length >= 1 ? selected[0] : undefined
    }

    function copyText(text: string, message?: string) {
        Clipboards.writeText(text)

        if (message) {
            dialogs.snackbar({message});
        }

    }

    async function withBatch<T>(transactions: ReadonlyArray<IAsyncTransaction<T>>,
                                opts: Partial<BatchMutatorOpts> = {}) {

        mutator.refresh();

        await BatchMutators.exec(transactions, {
            ...opts,
            refresh: mutator.refresh,
            dialogs
        });

    }

    function selectRow(viewID: IDStr,
                       event: React.MouseEvent,
                       type: SelectRowType) {

        const store = storeProvider();

        const selected = SelectionEvents2.selectRow(viewID,
                                                    store.selected,
                                                    store.view,
                                                    event,
                                                    type);

        setStore({
            ...store,
            selected: selected || []
        });

    }

    function selectedProvider(): ReadonlyArray<RepoDocInfo> {

        const store = storeProvider();

        const {view, selected} = store;

        return view.filter(current => selected.includes(current.id));

    }

    function setSelected(newSelected: ReadonlyArray<IDStr> | 'all' | 'none') {

        const store = storeProvider();

        const {view} = store;

        function computeSelected(): ReadonlyArray<IDStr> {

            if (newSelected === 'all') {
                return view.map(current => current.id);
            }

            if (newSelected === 'none') {
                return [];
            }

            return newSelected;

        }

        const selected = computeSelected();

        setStore({
            ...store,
            selected
        });
    }

    function setFilters(filters: DocRepoFilters2.Filter) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            filters,
            selected: []
        });
    }

    function setSort(order: Sorting.Order, orderBy: keyof IDocInfo) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            order,
            orderBy,
            selected: []
        });

    }

    // public setSidebarFilter(sidebarFilter: string) {
    //     const store = store.current;
    //
    //     setStore({...store, sidebarFilter});
    // }
    //

    // **** action / mutators

    function doTagged(repoDocInfos: ReadonlyArray<RepoDocInfo>,
                      tags: ReadonlyArray<Tag>,
                      strategy: ComputeNewTagsStrategy = 'set'): void {

        function toAsyncTransaction(repoDocInfo: RepoDocInfo) {
            const newTags = Tags.computeNewTags(repoDocInfo.tags, tags, strategy);
            return repoDocMetaManager!.writeDocInfoTags(repoDocInfo, newTags);
        }

        withBatch(repoDocInfos.map(toAsyncTransaction))
            .then(() => Analytics.event2("doc-tagged", { count: repoDocInfos.length }))
            .catch(err => log.error(err));

    }

    function doArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>, archived: boolean): void {

        const toAsyncTransaction = (repoDocInfo: RepoDocInfo): IAsyncTransaction<void> => {

            function prepare() {
                repoDocInfo.archived = archived;
                repoDocInfo.docInfo.archived = archived;
            }

            function commit() {
                return repoDocMetaManager.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
            }

            return {prepare, commit};
        }

        async function doHandle() {
            await withBatch(repoDocInfos.map(toAsyncTransaction));
        }

        doHandle()
            .then(() => Analytics.event2("doc-archived", { count: repoDocInfos.length, archived }))
            .catch(err => log.error(err));

    }

    function doFlagged(repoDocInfos: ReadonlyArray<RepoDocInfo>, flagged: boolean): void {

        const toAsyncTransaction = (repoDocInfo: RepoDocInfo): IAsyncTransaction<void> => {

            function prepare() {
                repoDocInfo.flagged = flagged;
                repoDocInfo.docInfo.flagged = flagged;
            }

            function commit() {
                return repoDocMetaManager.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
            }

            return {prepare, commit};

        }

        async function doHandle() {
            await withBatch(repoDocInfos.map(toAsyncTransaction));
        }

        doHandle()
            .then(() => Analytics.event2("doc-flagged", { count: repoDocInfos.length, flagged }))
            .catch(err => log.error(err));

    }

    function onUpdated(repoDocInfo: RepoDocInfo, docInfo: IDocInfo): void {

        const toAsyncTransaction = (repoDocInfo: RepoDocInfo): IAsyncTransaction<void> => {

            function prepare() {

                const docMeta = repoDocInfo.docMeta;
                docMeta.docInfo = docInfo;
                const newRepoDocInfo = RepoDocInfos.convert(docMeta,
                                                            repoDocInfo.fromCache,
                                                            repoDocInfo.hasPendingWrites);

                repoDocMetaManager.updateFromRepoDocInfo(repoDocInfo.fingerprint, newRepoDocInfo);

            }

            function commit() {
                repoDocInfo.docMeta.docInfo = docInfo;

                return repoDocMetaManager.writeDocInfo(docInfo, repoDocInfo.docMeta);
            }

            return {prepare, commit};

        }

        async function doHandle() {
            await withBatch([repoDocInfo].map(toAsyncTransaction));
        }

        doHandle()
            .catch(err => log.error(err));

    }


    function doCopyDocumentID(repoDocInfo: RepoDocInfo): void {
        const text = repoDocInfo.fingerprint;

        copyText(text, "Document ID copied to clipboard");
    }

    function doCopyOriginalURL(repoDocInfo: RepoDocInfo): void {

        function toText() {
            return repoDocInfo.url!;
        }

        const text = toText();
        copyText(text, "URL copied to clipboard");

    }

    function doDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>): void {

        function doDeleteBatch() {

            const toAsyncTransaction = (repoDocInfo: RepoDocInfo): IAsyncTransaction<void> => {

                function prepare() {

                    // TODO: write a tombstone here so the delete is updated in
                    // the UI immediately?

                }

                function commit() {
                    return repoDocMetaManager.deleteDocInfo(repoDocInfo);
                }

                return {prepare, commit};

            }

            const success = `${repoDocInfos.length} documents deleted.`;
            const error = `Failed to delete document: `;

            async function doHandle() {
                await withBatch(repoDocInfos.map(toAsyncTransaction), {success, error});
            }

            doHandle()
                .catch(err => log.error(err));

        }

        setSelected([]);

        doDeleteBatch();

        setSelected([]);

    }

    function doDropped(repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag): void {
        // this basically tags the document.
        doTagged(repoDocInfos, [tag], 'add');
    }

    function doOpen(repoDocInfo: RepoDocInfo): void {

        const fingerprint = repoDocInfo.fingerprint;

        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

        const docLoadRequest: LoadDocRequest = {
            fingerprint,
            title: repoDocInfo.title,
            url: repoDocInfo.url,
            backendFileRef,
            newWindow: true
        }

        docLoader(docLoadRequest);

    }

    function doRename(repoDocInfo: RepoDocInfo, title: string): void {

        async function doHandle() {
            mutator.refresh();
            await repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title);
        }

        doHandle()
            .catch(err => log.error("Could not write doc title: ", err));

    }

    // **** event handlers

    function onArchived() {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            return;
        }

        // if (repoDocInfos.length === 1) {
        //     const repoDocInfo = repoDocInfos[0];
        //     doArchived(repoDocInfos, ! repoDocInfo.archived);
        //     return;
        // }

        function computeNewArchived() {

            if (repoDocInfos.length === 1) {
                return ! repoDocInfos[0].archived;
            }

            const nrArchived = arrayStream(repoDocInfos)
                .filter(current => current.archived)
                .collect()
                .length;

            if (nrArchived === repoDocInfos.length) {
                return false;
            } else {
                return true;
            }

        }

        const newArchived = computeNewArchived();

        if (newArchived) {

            // only trigger the dialog when we're archiving , not removing from the archive.

            dialogs.confirm({
                title: "Are you sure you want to archive these document(s)?",
                subtitle: "They won't be deleted but will be hidden by default.",
                onCancel: NULL_FUNCTION,
                type: 'warning',
                onAccept: () => doArchived(repoDocInfos, newArchived),
            });
        } else {
            doArchived(repoDocInfos, newArchived);
        }

    }

    function onCopyDocumentID(): void {
        Optional.of(firstSelected()).map(doCopyDocumentID);
    }

    function onCopyOriginalURL(): void {
        Optional.of(firstSelected()).map(doCopyOriginalURL);
    }

    function onFlagged(): void {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {

            return;
        }

        if (repoDocInfos.length === 1) {
            const repoDocInfo = repoDocInfos[0];
            doFlagged(repoDocInfos, ! repoDocInfo.flagged);
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to flag these document(s)?",
            subtitle: "Flagging will allow these documents to stand out and prioritized among your other documents.",
            onCancel: NULL_FUNCTION,
            type: 'warning',
            onAccept: () => doFlagged(repoDocInfos, true),
        });

    }

    function onOpen(): void {
        doOpen(firstSelected()!);
    }

    function onTagSelected(tags: ReadonlyArray<Tag>): void {
        const store = storeProvider();
        setFilters({...store.filters, tags});
    }

    function onDragStart(event: React.DragEvent) {

        console.log("onDragStart");

        const configureDragImage = () => {
            // TODO: this actually DOES NOT work but it's a better effect than the
            // default and a lot less confusing.  In the future we should migrate
            // to showing the thumbnail of the doc once we have this feature
            // implemented.

            const src: HTMLElement = document.createElement("div");

            // https://kryogenix.org/code/browser/custom-drag-image.html
            event.dataTransfer!.setDragImage(src, 0, 0);

        };

        configureDragImage();

    }

    function onDragEnd() {
        // noop
    }

    function onDropped(tag: Tag) {
        const selected = selectedProvider();
        doDropped(selected, tag);
    }

    function onRename() {

        const repoDocInfo = firstSelected();

        if (! repoDocInfo) {
            console.log("No docs selected");
            return;
        }

        dialogs.prompt({
            title: "Enter a new title for the document:",
            defaultValue: repoDocInfo.title,
            onCancel: NULL_FUNCTION,
            onDone: (value) => doRename(repoDocInfo, value)
        });

    }

    function onDeleted() {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            // no work to do
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'warning',
            onAccept: () => doDeleted(repoDocInfos),
        });

    }

    function onTagged() {

        const {relatedTagsManager} = repoDocMetaManager;
        const relatedOptionsCalculator = relatedTagsManager.toRelatedOptionsCalculator();

        const opts: TaggedCallbacksOpts<RepoDocInfo> = {
            targets: selectedProvider,
            tagsProvider: () => tagsProvider(),
            dialogs,
            doTagged,
            relatedOptionsCalculator
        };

        const callback = TaggedCallbacks.create(opts);

        callback();
    }

    function setLeftDockOpen(state: boolean) {
        const store = storeProvider();
        setStore({...store, isLeftDockOpen: state});
    }

    // I don't know of a better way to return / organize the callbacks here
    // and think this is a bit ugly but I can't think of a better way to handle
    // this.

    return {
        setLeftDockOpen,
        selectedProvider,

        selectRow,
        setSelected,
        setFilters,
        setSort,

        doTagged,
        doOpen,
        doRename,
        doCopyOriginalURL,
        doCopyDocumentID,
        doDeleted,
        doArchived,
        doFlagged,
        onUpdated,

        doDropped,

        onTagged,
        onOpen,
        onRename,
        onCopyOriginalURL,
        onCopyDocumentID,
        onDeleted,
        onArchived,
        onFlagged,

        onDragStart,
        onDragEnd,
        onDropped,

        onTagSelected,

    };

}

const useCallbacksFactory = (storeProvider: Provider<IDocRepoStore>,
                          setStore: (store: IDocRepoStore) => void,
                          mutator: Mutator): IDocRepoCallbacks => {

    const dialogs = useDialogManager();
    const repoDocMetaManager = useRepoDocMetaManager();
    const tagsProvider = useTagsProvider();
    const persistence = usePersistenceContext();
    const log = useLogger();

    // TODO: we should probably useMemo below but then we get a ton of React
    // hooks errors for some reason.

    const tagsProviderRef = useRefWithUpdates(tagsProvider);

    return useCreateCallbacks(storeProvider,
                              setStore,
                              mutator,
                              repoDocMetaManager,
                              () => tagsProviderRef.current(),
                              dialogs,
                              persistence,
                              log);

    // return React.useMemo(() => {
    //     return createCallbacks(storeProvider,
    //                            setStore,
    //                            mutator,
    //                            repoDocMetaManager,
    //                            tagsProvider,
    //                            dialogs,
    //                            persistence,
    //                            log);
    // }, [dialogs, repoDocMetaManager, tagsProvider, persistence, log]);

}

export const [DocRepoStoreProvider, useDocRepoStore, useDocRepoCallbacks, useDocRepoMutator, useDocRepoStoreReducer]
    = createObservableStoreWithPrefsContext<IDocRepoStore, Mutator, IDocRepoCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory,
        enableShallowEquals: true
    },
    'doc_repo_store',
    ['order', 'orderBy']);

DocRepoStoreProvider.displayName='DocRepoStoreProvider';

interface IProps {
    readonly children: JSX.Element;
}

/**
 * Once the provider is in place, we load the repo which uses the observer store.
 */
const DocRepoStoreLoader = React.memo(function DocRepoStoreLoader(props: IProps) {

    const repoDocMetaLoader = useRepoDocMetaLoader();
    const repoDocMetaManager = useRepoDocMetaManager();
    const docRepoMutator = useDocRepoMutator();
    const callbacks = useDocRepoCallbacks();

    const doRefresh = React.useMemo(() => Debouncers.create(() => docRepoMutator.refresh()), [docRepoMutator]);

    useComponentDidMount(() => {
        docRepoMutator.setDataProvider(() => repoDocMetaManager.repoDocInfoIndex.values());
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh)
    });

    useComponentWillUnmount(() => {

        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh),
                                      "Failed to remove event listener");
    });

    const tagSidebarEventForwarder = React.useMemo<TagSidebarEventForwarder>(() => {
        return {
            onTagSelected: callbacks.onTagSelected,
            onDropped: callbacks.onDropped
        }
    }, [callbacks]);

    return (
        <TagSidebarEventForwarderContext.Provider value={tagSidebarEventForwarder}>
            {props.children}
        </TagSidebarEventForwarderContext.Provider>
    );

});

export const DocRepoStore2 = React.memo((props: IProps) => {

    return (
        <DocRepoStoreProvider>
            <DocRepoStoreLoader>
                <>
                    {props.children}
                    <AddFileDropzone/>
                </>
            </DocRepoStoreLoader>
        </DocRepoStoreProvider>
    );

});
