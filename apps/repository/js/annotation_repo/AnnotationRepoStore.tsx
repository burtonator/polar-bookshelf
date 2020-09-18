import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepoDocInfo} from "../RepoDocInfo";
import {Sorting} from "../doc_repo/Sorting";
import {Mappers} from "polar-shared/src/util/Mapper";
import {AnnotationRepoFilters2} from "./AnnotationRepoFilters2";
import {createObservableStore} from "../../../../web/js/react/store/ObservableStore";
import React from "react";
import {
    IPersistenceContext,
    usePersistenceContext,
    useRepoDocMetaLoader,
    useRepoDocMetaManager
} from "../persistence_layer/PersistenceLayerApp";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {
    TagSidebarEventForwarder,
    TagSidebarEventForwarderContext
} from "../store/TagSidebarEventForwarder";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Provider} from "polar-shared/src/util/Providers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {Either} from "../../../../web/js/util/Either";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {DialogManager} from "../../../../web/js/mui/dialogs/MUIDialogController";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Tag} from "polar-shared/src/tags/Tags";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {
    Exporters,
    ExportFormat
} from "../../../../web/js/metadata/exporter/Exporters";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {
    AnnotationMutationCallbacks,
    AnnotationMutationsContextProvider,
    IAnnotationMutationCallbacks,
    IAnnotationMutationSelected
} from "../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IDStr} from "polar-shared/src/util/Strings";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {RepoDocMetas} from "../RepoDocMetas";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IAnnotationRef} from "polar-shared/src/metadata/AnnotationRefs";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {ILogger} from "polar-shared/src/logger/ILogger";
import {AddFileDropzone} from "../../../../web/js/apps/repository/upload/AddFileDropzone";
import {useDocLoader} from "../../../../web/js/apps/main/DocLoaderHooks";
import {IMouseEvent} from "../doc_repo/MUIContextMenu";

interface IAnnotationRepoStore {

    readonly data: ReadonlyArray<IDocAnnotation>;

    readonly view: ReadonlyArray<IDocAnnotation>;

    readonly viewPage: ReadonlyArray<IDocAnnotation>;

    /**
     * The selected records as IDs to annotations.
     */
    readonly selected: ReadonlyArray<IDStr>;

    /**
     * The page number we're viewing
     */
    readonly page: number;

    /**
     * The rows per page we have.
     */
    readonly rowsPerPage: number;


    /**
     * The sorting order.
     */
    readonly order: Sorting.Order,

    /**
     * The column we are sorting by.
     */
    readonly orderBy: keyof RepoDocInfo;

    readonly filter: AnnotationRepoFilters2.Filter;

}

interface IAnnotationRepoCallbacks {

    readonly selectRow: (selectedID: IDStr,
                         event: IMouseEvent,
                         type: SelectRowType) => void;

    /**
     * Called when the user is filtering the UI based on a tag and is narrowing
     * down what's displayed by one or more tag.
     */
    readonly onTagSelected: (tags: ReadonlyArray<Tag>) => void;

    readonly setPage: (page: number) => void;

    readonly setRowsPerPage: (rowsPerPage: number) => void;

    readonly doOpen: (docInfo: IDocInfo) => void;

    readonly doUpdated: (annotation: IDocAnnotation) => void;

    readonly onTagged: () => void;

    readonly onDeleted: () => void;

    readonly onExport: (format: ExportFormat) => void;

    readonly setFilter: (filter: Partial<AnnotationRepoFilters2.Filter>) => void;

    readonly onDragStart: (event: React.DragEvent) => void;
    readonly onDragEnd: () => void;

    readonly doDropped: (annotations: ReadonlyArray<IDocAnnotation>, tag: Tag) => void;

    readonly onDropped: (tag: Tag) => void;

    readonly annotationMutations: IAnnotationMutationCallbacks;

}

const initialStore: IAnnotationRepoStore = {
    data: [],
    view: [],
    viewPage: [],
    selected: [],

    page: 0,
    rowsPerPage: 25,
    order: 'desc',
    orderBy: 'progress',

    filter: {
        colors: [],
        text: "",
        tags: [],
        annotationTypes: []
    },
}

interface Mutator {

    doReduceAndUpdateState: (newStore: IAnnotationRepoStore) => void;
    setDataProvider: (dataProvider: DataProvider) => void;
    refresh: () => void;

}

type DataProvider = Provider<ReadonlyArray<IDocAnnotation>>;

function mutatorFactory(storeProvider: Provider<IAnnotationRepoStore>,
                        setStore: (store: IAnnotationRepoStore) => void): Mutator {

    let dataProvider: DataProvider = () => [];

    function doSort(data: ReadonlyArray<IDocAnnotation>) {

        // TODO: try to move to the same sort infra as the doc repo so that
        // we can reference columns, etc.

        return arrayStream(data)
            .sort((a, b) => {

                const toTimestamp = (val: IDocAnnotation): string => {
                    return val.lastUpdated ?? val.created ?? '';
                };

                return toTimestamp(b).localeCompare(toTimestamp(a));
            })
            .collect();

    }

    function reduce(tmpStore: IAnnotationRepoStore): IAnnotationRepoStore {

        // compute the view, then the viewPage

        // TODO: we only have to resort and recompute the view when the filters
        // or the sort order changes.

        // TODO: more sort options...

        // TODO: try to auto select the first item BUT the problem is that we
        // might not want to do this due to updates that aren't reloading the
        // page.  Make sure all the mutation type would work with this.

        const {data, page, rowsPerPage, filter} = tmpStore;

        // Now that we have new data, we have to also apply the filters and sort
        // order to the results, then update the view + viewPage

        // TODO: sort with Sorting.stableSort.
        const view = Mappers.create(data)
            .map(current => AnnotationRepoFilters2.execute(current, filter))
            // .map(current => Sorting.stableSort(current, Sorting.getComparator(order, orderBy)))
            .map(current => doSort(current))
            .collect();

        const viewPage = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return {...tmpStore, view, viewPage};

    }

    function doReduceAndUpdateState(tmpState: IAnnotationRepoStore) {

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

    return {doReduceAndUpdateState, refresh, setDataProvider};

}


const createCallbacks = (storeProvider: Provider<IAnnotationRepoStore>,
                         setStore: (store: IAnnotationRepoStore) => void,
                         mutator: Mutator,
                         dialogs: DialogManager,
                         persistence: IPersistenceContext,
                         repoDocMetaLoader: RepoDocMetaLoader,
                         repoDocMetaManager: RepoDocMetaManager,
                         log: ILogger): IAnnotationRepoCallbacks => {

    const docLoader = useDocLoader();

    const annotationMutations = AnnotationMutationCallbacks.create(updateStore, refresher);

    function updateStore(docMetas: ReadonlyArray<IDocMeta>): ReadonlyArray<IDocMeta> {

        const {persistenceLayerProvider} = persistence;

        for (const docMeta of docMetas) {
            const fingerprint = docMeta.docInfo.fingerprint;
            const repoDocMeta = RepoDocMetas.convert(persistenceLayerProvider, fingerprint, docMeta);
            repoDocMetaManager.updateFromRepoDocMeta(docMeta.docInfo.fingerprint, repoDocMeta);
        }

        return docMetas;

    }

    function refresher() {
        mutator.refresh();
    }

    function selectedAnnotations<T extends IAnnotationMutationSelected>(opts?: T): ReadonlyArray<IAnnotationRef> {

        if (opts && opts.selected) {
            return opts.selected;
        }

        const store = storeProvider();

        const {selected, viewPage} = store;

        return viewPage.filter(current => selected.includes(current.id));

    }

    function doOpen(docInfo: IDocInfo): void {

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

        const docLoadRequest = {
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || 'Untitled',
            backendFileRef,
            newWindow: true
        }

        docLoader(docLoadRequest);

    }

    function selectRow(selectedID: IDStr,
                       event: IMouseEvent,
                       type: SelectRowType) {


        const store = storeProvider();

        const selected = SelectionEvents2.selectRow(selectedID,
                                                    store.selected,
                                                    store.viewPage,
                                                    event,
                                                    type);

        mutator.doReduceAndUpdateState({
            ...store,
            selected
        });

    }

    /**
     * Called when the user is filtering the UI based on a tag and is narrowing
     * down what's displayed by one or more tag.
     */
    function onTagSelected(tags: ReadonlyArray<Tag>) {

        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            page: 0,
            selected: [],
            filter: {
                ...store.filter,
                tags
            }
        });

    }

    function setPage(page: number) {

        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            page,
            selected: []
        });

    }

    function setRowsPerPage(rowsPerPage: number) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            rowsPerPage,
            page: 0,
            selected: []
        });

    }

    function onTagged() {
        const selected = selectedAnnotations();
        annotationMutations.onTagged({selected});
    }

    function doUpdated(annotation: IDocAnnotation) {

        const {docMeta, original} = annotation;


        async function doAsync() {

            AnnotationMutations.update(annotation, original);

            await repoDocMetaLoader.update(docMeta, 'updated');

            const {persistenceLayerProvider} = persistence;
            const persistenceLayer = persistenceLayerProvider();
            await persistenceLayer.writeDocMeta(docMeta);

        }

        doAsync()
            .catch(err => log.error(err));

    }

    function doExport(format: ExportFormat) {

        const store = storeProvider();;

        async function doAsync() {

            const {persistenceLayerProvider} = persistence;
            await Exporters.doExportForAnnotations(persistenceLayerProvider,
                                                   store.view,
                                                   format);
        }

        doAsync()
            .catch(err => log.error("Unable to download: ", err));

    }

    function onExport(format: ExportFormat) {
        // TODO: we might want to confirm if they are downloading a LARGE
        // number of annotations
        doExport(format);
    }

    function setFilter(filter: Partial<AnnotationRepoFilters2.Filter>) {

        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            filter: {
                ...store.filter,
                ... filter
            }
        });

    }

    function onDeleted() {
        const selected = selectedAnnotations();
        annotationMutations.onDeleted({selected});
    }

    function onDragStart(event: React.DragEvent) {
        // noop
    }

    function onDragEnd() {
        // noop
    }

    function doDropped(annotations: ReadonlyArray<IAnnotationRef>, tag: Tag) {
        annotationMutations.doTagged(annotations, [tag], 'add');
    }

    function onDropped(tag: Tag) {
        const selected = selectedAnnotations();
        doDropped(selected, tag);
    }

    return {
        doOpen,
        selectRow,
        onTagSelected,
        setPage,
        setRowsPerPage,
        onTagged,
        onExport,
        setFilter,
        doUpdated,
        onDeleted,
        onDragStart,
        onDragEnd,
        doDropped,
        onDropped,
        annotationMutations
    };

}

function callbacksFactory (storeProvider: Provider<IAnnotationRepoStore>,
                          setStore: (store: IAnnotationRepoStore) => void,
                          mutator: Mutator): IAnnotationRepoCallbacks {

    const dialogs = useDialogManager();
    const persistence = usePersistenceContext();
    const repoDocMetaLoader = useRepoDocMetaLoader();
    const repoDocMetaManager = useRepoDocMetaManager();
    const log = useLogger();

    return createCallbacks(storeProvider,
                           setStore,
                           mutator,
                           dialogs,
                           persistence,
                           repoDocMetaLoader,
                           repoDocMetaManager,
                           log);

}

export const [AnnotationRepoStoreProvider, useAnnotationRepoStore, useAnnotationRepoCallbacks, useAnnotationRepoMutator]
    = createObservableStore<IAnnotationRepoStore, Mutator, IAnnotationRepoCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});

interface IProps {
    readonly children: JSX.Element;
}

/**
 * Once the provider is in place, we load the repo which uses the observer store.
 */
const AnnotationRepoStoreInner = React.memo((props: IProps) => {

    // TODO: migrate to useRepoDocInfos

    const repoDocMetaLoader = useRepoDocMetaLoader();
    const repoDocMetaManager = useRepoDocMetaManager();
    const annotationRepoMutator = useAnnotationRepoMutator();
    const annotationRepoCallbacks = useAnnotationRepoCallbacks();

    const doRefresh = React.useCallback(Debouncers.create(() => {
        annotationRepoMutator.refresh();
    }), []);

    useComponentDidMount(() => {
        annotationRepoMutator.setDataProvider(() => repoDocMetaManager.repoDocAnnotationIndex.values());
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh)
    });

    useComponentWillUnmount(() => {

        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh),
                                      "Failed to remove event listener");
    });

    const tagSidebarEventForwarder = React.useMemo<TagSidebarEventForwarder>(() => {
        return {
            onTagSelected: annotationRepoCallbacks.onTagSelected,
            onDropped: annotationRepoCallbacks.onDropped
        }
    }, [annotationRepoCallbacks]);

    return (
        <TagSidebarEventForwarderContext.Provider value={tagSidebarEventForwarder}>
            <AnnotationMutationsContextProvider value={annotationRepoCallbacks.annotationMutations}>
                {props.children}
            </AnnotationMutationsContextProvider>
        </TagSidebarEventForwarderContext.Provider>
    );

});

export const AnnotationRepoStore2 = React.memo((props: IProps) => {

    return (
        <AnnotationRepoStoreProvider>
            <AnnotationRepoStoreInner>
                <>
                    {props.children}
                    <AddFileDropzone/>
                </>
            </AnnotationRepoStoreInner>
        </AnnotationRepoStoreProvider>
    )

});
