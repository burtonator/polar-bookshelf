import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import React, {useEffect, useState} from "react";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {Provider} from "polar-shared/src/util/Providers";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DocRepoFilters2} from "./DocRepoFilters2";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SelectRowType} from "./DocRepoScreen";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {
    Callback,
    Callback1,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Mappers} from "polar-shared/src/util/Mapper";

interface IDocRepoStore {

    readonly data: ReadonlyArray<RepoDocInfo>;

    /**
     * The sorted view of the data based on the order and orderBy.
     */
    readonly view: ReadonlyArray<RepoDocInfo>;

    /**
     * The page data based on a slice of view, and the page number.
     */
    readonly viewPage: ReadonlyArray<RepoDocInfo>;

    /**
     * The columns the user wants to view.
     */
    readonly columns: DocRepoTableColumnsMap;

    /**
     * The selected records as pointers in to viewPage
     */
    readonly selected: ReadonlyArray<number>;

    /**
     * The sorting order.
     */
    readonly order: Sorting.Order,

    /**
     * The column we are sorting by.
     */
    readonly orderBy: keyof RepoDocInfo;

    /**
     * The page number we're viewing
     */
    readonly page: number;

    /**
     * The rows per page we have.
     */
    readonly rowsPerPage: number;

    readonly filters: DocRepoFilters2.Filters;

}

export interface IDocRepoActions {

    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>;

    readonly selectRow: (selectedIdx: number,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

    readonly setPage: (page: number) => void;

    // FIXME: not sure if these are actually needed or we can use Callbacks
    // here...
    readonly onTagged: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onOpen: Callback1<RepoDocInfo>;
    readonly onRename: Callback1<RepoDocInfo>;
    readonly onShowFile: Callback1<RepoDocInfo>;
    readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
    readonly onCopyFilePath: Callback1<RepoDocInfo>;
    readonly onCopyDocumentID: Callback1<RepoDocInfo>;
    readonly onDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;


    // readonly setFilters: (filters: DocRepoFilters2.Filters) => {
    //
    // }

}

/**
 * These take the currently selected items, and use the store ctions on them
 * directly so that the logic around selected vs first is centralized in
 * the store.
 */
interface IDocRepoCallbacks {
    readonly onTagged: Callback;
    readonly onOpen: Callback;
    readonly onRename: Callback;
    readonly onShowFile: Callback;
    readonly onCopyOriginalURL: Callback;
    readonly onCopyFilePath: Callback;
    readonly onCopyDocumentID: Callback;
    readonly onDeleted: Callback;
    readonly onArchived: Callback;
    readonly onFlagged: Callback;
}

const initialStore: IDocRepoStore = {
    data: [],
    view: [],
    viewPage: [],
    selected: [],

    // FIXME this is actually another component and shouldn't be here I think..

    // FIXME: I think some of these are more the view configuration and
    // should probably be sorted outside the main repo
    columns: IDMaps.create(Object.values(new DocRepoTableColumns())),

    orderBy: 'progress',
    order: 'desc',
    page: 0,
    rowsPerPage: 25,

    filters: {},
}

const initialActions: IDocRepoActions = {
    selectRow: NULL_FUNCTION,
    selectedProvider: () => [],

    setPage: NULL_FUNCTION,

    onTagged: NULL_FUNCTION,
    onOpen: NULL_FUNCTION,
    onRename: NULL_FUNCTION,
    onShowFile: NULL_FUNCTION,
    onCopyOriginalURL: NULL_FUNCTION,
    onCopyFilePath: NULL_FUNCTION,
    onCopyDocumentID: NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onArchived: NULL_FUNCTION,
    onFlagged: NULL_FUNCTION,
}

const initialCallbacks: IDocRepoCallbacks = {
    onTagged: NULL_FUNCTION,
    onOpen: NULL_FUNCTION,
    onRename: NULL_FUNCTION,
    onShowFile: NULL_FUNCTION,
    onCopyOriginalURL: NULL_FUNCTION,
    onCopyFilePath: NULL_FUNCTION,
    onCopyDocumentID: NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onArchived: NULL_FUNCTION,
    onFlagged: NULL_FUNCTION,
}

export const DocRepoStoreContext = React.createContext<IDocRepoStore>(initialStore)

export const DocRepoActionsContext = React.createContext<IDocRepoActions>(initialActions)

export const DocRepoCallbacksContext = React.createContext<IDocRepoCallbacks>(initialCallbacks)

export function useDocRepoStore() {
    return React.useContext(DocRepoStoreContext);
}

export function useDocRepoActions() {
    return React.useContext(DocRepoActionsContext);
}

export function useDocRepoCallbacks() {
    return React.useContext(DocRepoCallbacksContext);
}

function useComponentDidMount<T>(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
    useEffect(() => delegate(), []);
}

function useComponentWillUnmount(delegate: () => void) {
    useEffect(() => delegate, []);
}

interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly children: React.ReactNode;
}

/**
 * Apply a reducer a temporary state, to compute the effective state.
 */
function reduce(tmpState: IDocRepoStore): IDocRepoStore {

    // compute the view, then the viewPage

    console.log("FIXME: working with tmpState: ", tmpState);

    const {data, page, rowsPerPage, order, orderBy, filters} = tmpState;

    // Now that we have new data, we have to also apply the filters and sort
    // order to the results, then update the view + viewPage

    const view = Mappers.create(data)
                        // .map(current => DocRepoFilters2.execute(current, filters))
                        .map(current => Sorting.stableSort(current, Sorting.getComparator(order, orderBy)))
                        .collect()

    const viewPage = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return {...tmpState, view, viewPage};

}

// function createInitialState() {
//
//     const state = {
//         ...initialState
//     };
//
//     return {
//         ...state,
//     }
//
// }


export const DocRepoStore = (props: IProps) => {

    // FIXME: what functions do I need

    // delete(repoDocInfos: ReadonlyArray<RepoDocInfo>)
    //

    // FIXME: how can we have the state update itself?.... createInitialState function??

    const {repoDocMetaLoader, repoDocMetaManager} = props;
    const [state, setState] = useState<IDocRepoStore>({...initialStore});

    const doUpdate = () => {
        setTimeout(() => {
            const data = repoDocMetaManager.repoDocInfoIndex.values();
            setState(reduce({...state, data}));
        }, 1)
    }

    // the debouncer here is VERY important... otherwise we lock up completely
    const eventListener = Debouncers.create(() => {
        // FIXME: we seem to get aLL the docs all at once even though
        // I'm getting the callbacks properly..
        doUpdate();
    });

    useComponentDidMount(() => {
        doUpdate();
        repoDocMetaLoader.addEventListener(eventListener)
    });

    useComponentWillUnmount(() => {
        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(eventListener),
                                      "Failed to remove event listener");
    });

    const selectRow = React.useCallback((selectedIdx: number,
                                         event: React.MouseEvent,
                                         type: SelectRowType) => {

        const selected = Callbacks.selectRow(selectedIdx, event, type);

        setState({
            ...state,
            selected: selected || []
        });
    }, []);

    const selectedProvider = React.useCallback((): ReadonlyArray<RepoDocInfo> => {
        return arrayStream(state.selected)
            .map(current => state.view[current])
            .collect();
    }, []);

    const setPage = React.useCallback((page: number) => {

        console.log("FIXME: setting page with state: ", state);

        // FIXME: the wrong state is being referenced here...

        setState({
            ...state,
            page
        });

        // FIXME as  soon as I make the state a dependency this updated properly
        //
    }, [state]);

    const store: IDocRepoStore = {
        ...state,
    };

    const actions: IDocRepoActions = {
        ...initialActions,
        selectedProvider,
        selectRow,
        setPage
    };

    const callbacks = React.useMemo((): IDocRepoCallbacks => {

        // must be created on init we have a stable copy
        const selected = selectedProvider();
        const first = selected.length >= 1 ? selected[0] : undefined;

        return {

            onOpen: () => actions.onOpen(first!),
            onRename: () => actions.onRename(first!),
            onShowFile: () => actions.onShowFile(first!),
            onCopyOriginalURL: () => actions.onCopyOriginalURL(first!),
            onCopyFilePath: () => actions.onCopyFilePath(first!),
            onCopyDocumentID: () => actions.onCopyDocumentID(first!),
            onDeleted: () => actions.onDeleted(selected),
            onArchived: () => actions.onArchived(selected),
            onFlagged: () => actions.onFlagged(selected),
            onTagged: () => actions.onTagged(selected),

        };

    }, []);

    // FIXME now the main problem is whether we're going to create actions
    // implementations each time... and how would I know..

    return (
        <DocRepoStoreContext.Provider value={store}>
            <DocRepoActionsContext.Provider value={actions}>
                <DocRepoCallbacksContext.Provider value={callbacks}>
                {props.children}
                </DocRepoCallbacksContext.Provider>
            </DocRepoActionsContext.Provider>
        </DocRepoStoreContext.Provider>
    );

}


// FIXME: move this outside...
namespace Callbacks {

    export function selectRow(selectedIdx: number,
                              event: React.MouseEvent,
                              type: SelectRowType) {

        selectedIdx = Numbers.toNumber(selectedIdx);

        // there are really only three strategies
        //
        // - one: select ONE item and unselect the previous item(s).  This is done when we have
        //        a single click on an item.  It always selects it and never de-selects it.
        //
        // - add the new selectedIndex to the list of currently selected items.
        //
        //   - FIXME: really what this is is just select-one but we leave the
        //     previous items in place and perform no mutation on them...

        // - toggle: used when the type is 'checkbox' because we're only toggling
        //   the selection of that one item
        //
        // - none: do nothing.  this is used when the context menu is being used and no additional
        //         items are being changed.

        type SelectionStrategy = 'one' | 'range' | 'toggle' | 'none';

        type SelectedRows = ReadonlyArray<number>;

        const computeStrategy = (): SelectionStrategy => {

            if (type === 'checkbox') {
                return 'toggle';
            }

            if (type === 'click') {

                if (event.getModifierState("Shift")) {
                    return 'range';
                }

                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }

            }

            if (type === 'context') {

                if (this.state.selected.includes(selectedIdx)) {
                    return 'none';
                }

            }

            return 'one';

        };

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            const selected = [...Numbers.range(Math.min(min, selectedIdx),
                Math.max(max, selectedIdx))];

            return selected;

        };

        const doStrategyToggle = (): SelectedRows => {
            const selected = [...this.state.selected];

            if (selected.includes(selectedIdx)) {
                return SetArrays.difference(selected, [selectedIdx]);
            } else {
                return SetArrays.union(selected, [selectedIdx]);
            }

        };

        const doStrategyOne = (): SelectedRows => {
            return [selectedIdx];
        };

        const doStrategy = (): SelectedRows | undefined => {

            const strategy = computeStrategy();

            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return undefined;
            }

        };

        return doStrategy();

    }
}
