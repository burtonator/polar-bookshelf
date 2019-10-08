import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag} from '../../../../web/js/tags/Tags';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Tags} from '../../../../web/js/tags/Tags';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {MessageBanner} from '../MessageBanner';
import {DocRepoTableDropdown} from './DocRepoTableDropdown';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import {SettingsStore} from '../../../../web/js/datastore/SettingsStore';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {RepoHeader} from '../repo_header/RepoHeader';
import {FixedNav} from '../FixedNav';
import {ListOptionType} from '../../../../web/js/ui/list_selector/ListSelector';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocRepoFilterBar} from './DocRepoFilterBar';
import {DocRepoFilters, RefreshedCallback} from './DocRepoFilters';
import {Settings} from '../../../../web/js/datastore/Settings';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {ProgressTracker} from '../../../../web/js/util/ProgressTracker';
import {ProgressMessages} from '../../../../web/js/ui/progress_bar/ProgressMessages';
import {Dialogs} from '../../../../web/js/ui/dialogs/Dialogs';
import {DocRepoButtonBar} from './DocRepoButtonBar';
import {DocRepoTable} from './DocRepoTable';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TreeState} from '../../../../web/js/ui/tree/TreeView';
import {Instance} from "react-table";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

// TODO: go back to ExtendedReactTable

export default class DocRepoScreen extends ReleasingReactComponent<IProps, IState> {

    private readonly treeState: TreeState<TagDescriptor>;

    private static hasSentInitAnalytics = false;

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private reactTable?: Instance;

    private readonly docRepoFilters: DocRepoFilters;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerManager);

        this.onDocDeleteRequested = this.onDocDeleteRequested.bind(this);

        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);

        this.onFilterByTitle = this.onFilterByTitle.bind(this);
        this.onToggleFilterArchived = this.onToggleFilterArchived.bind(this);
        this.onToggleFlaggedOnly = this.onToggleFlaggedOnly.bind(this);

        this.clearSelected = this.clearSelected.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this.selectRow = this.selectRow.bind(this);

        this.onMultiTagged = this.onMultiTagged.bind(this);
        this.onMultiDeleted = this.onMultiDeleted.bind(this);

        this.getSelected = this.getSelected.bind(this);

        this.state = {
            data: [],
            tags: [],
            columns: new DocRepoTableColumns(),
            selected: []
        };

        const onRefreshed: RefreshedCallback = repoDocInfos => this.doRefresh(repoDocInfos);

        const repoDocInfosProvider = () => this.props.repoDocMetaManager!.repoDocInfoIndex.values();

        this.docRepoFilters =
            new DocRepoFilters(onRefreshed, repoDocInfosProvider);

        this.treeState = new TreeState(tags => this.docRepoFilters.onTagged(tags.map(current => Tags.create(current))));

        this.init();

        this.initAsync()
            .catch(err => log.error("Could not init: ", err));

    }

    private init() {

        // TODO: when we get a NEW persistence layer we probably need to release
        // the old event listener as the component is still mounted but the old
        // persistence layer has now gone away.

        PersistenceLayerManagers.onPersistenceManager(this.props.persistenceLayerManager, (persistenceLayer) => {

            this.releaser.register(
                persistenceLayer.addEventListener(() => this.refresh()));

        });

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => this.refresh()));

        this.releaser.register(
            this.props.repoDocMetaLoader.addEventListener(event => {

                if (!DocRepoScreen.hasSentInitAnalytics && event.progress.progress === 100) {
                    this.emitInitAnalytics(this.props.repoDocMetaManager.repoDocInfoIndex.size());
                    DocRepoScreen.hasSentInitAnalytics = true;
                }

            })
        );

    }

    private async initAsync(): Promise<void> {

        const settingProvider = await SettingsStore.load();

        log.info("Settings loaded: ", settingProvider);

        Optional.of(settingProvider().documentRepository)
            .map(current => current.columns)
            .when(columns => {

                // columns = Object.assign( new DocRepoTableColumns(), columns);

                log.info("Loaded columns from settings: ", columns);
                this.setState({...this.state, columns});
                this.refresh();

            });

        this.refresh();

    }

    private emitInitAnalytics(nrDocs: number) {

        // TODO: move some of these analytics into the main RepoaitoryApp.tsx.

        RendererAnalytics.set({'nrDocs': nrDocs});

        const persistenceLayerType = this.persistenceLayerManager.currentType();

        RendererAnalytics.event({category: 'document-repository', action: `docs-loaded-${persistenceLayerType}-${nrDocs}`});

    }

    private onMultiTagged(tags: ReadonlyArray<Tag>) {

        const repoDocInfos = this.getSelected();

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const effectTags = Tags.union(existingTags, tags || []);

            this.onDocTagged(repoDocInfo, effectTags)
                .catch(err => log.error(err));

        }

    }

    private onMultiDeleted() {
        const repoDocInfos = this.getSelected();
        this.onDocDeleteRequested(...repoDocInfos);
    }

    private clearSelected() {

        setTimeout(() => {
            this.setState({...this.state, selected: []});
        }, 1);

    }

    private getSelected(): RepoDocInfo[] {

        const resolvedState = this.reactTable!.getResolvedState();

        const sortedData = resolvedState.sortedData;

        const result: RepoDocInfo[] =
            this.state.selected
                .map(selectedIdx => sortedData[selectedIdx])
                .filter(item => isPresent(item))
                .map(item => item._original);

        return result;

    }


    public selectRow(selectedIdx: number,
                     event: MouseEvent, checkbox: boolean = false) {

        if (typeof selectedIdx === 'string') {
            selectedIdx = parseInt(selectedIdx);
        }

        let selected: number[] = [selectedIdx];

        if (event.getModifierState("Shift")) {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            selected = [...Numbers.range(Math.min(min, selectedIdx),
                                         Math.max(max, selectedIdx))];

        }

        const selectIndividual = (event.getModifierState("Control") || event.getModifierState("Meta")) || checkbox;

        if (selectIndividual) {

            // one at a time

            selected = [...this.state.selected];

            if (selected.includes(selectedIdx)) {
                selected.splice(selected.indexOf(selectedIdx), 1);
            } else {
                selected = [...selected, selectedIdx];
            }

        }

        this.setState({...this.state, selected});

    }

    public onSelected(selected: ReadonlyArray<number>) {
        this.setState({ ...this.state, selected });
    }

    public render() {

        const tagsProvider = () => this.props.repoDocMetaManager!.repoDocInfoIndex.toTagDescriptors();

        return (
            <div id="doc-repository"
                 style={{
                     height: '100%'
                 }}>

                <FixedNav id="doc-repo-table">

                    <header>

                        <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                        <div id="header-filter">

                            <div style={{display: 'flex'}}
                                 className="mt-1 mb-1">

                                <div className=""
                                     style={{
                                         whiteSpace: 'nowrap',
                                         marginTop: 'auto',
                                         marginBottom: 'auto',
                                         display: 'flex'
                                     }}>

                                    <DocRepoButtonBar hasSelected={this.state.selected.length > 0}
                                                      tagsProvider={tagsProvider}
                                                      onMultiTagged={tags => this.onMultiTagged(tags)}
                                                      onMultiDeleted={() => this.onMultiDeleted()}/>

                                </div>

                                <div style={{marginLeft: 'auto'}}>

                                    <DocRepoFilterBar onToggleFlaggedOnly={value => this.onToggleFlaggedOnly(value)}
                                                      onToggleFilterArchived={value => this.onToggleFilterArchived(value)}
                                                      onFilterByTitle={(title) => this.onFilterByTitle(title)}
                                                      tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                      refresher={() => this.refresh()}
                                                      filteredTags={this.docRepoFilters.filters.filteredTags}
                                                      right={
                                                   <div className="d-mobile-none"
                                                        style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                                       <DocRepoTableDropdown id="table-dropdown"
                                                                             options={Object.values(this.state.columns)}
                                                                             onSelectedColumns={(selectedColumns) => this.onSelectedColumns(selectedColumns)}/>
                                                   </div>
                                               }
                                    />

                                </div>

                            </div>

                        </div>

                        <MessageBanner/>

                    </header>


                    <Dock
                        componentClassNames={{
                            left: 'd-none-mobile',
                            splitter: 'd-none-mobile'
                        }}
                        left={
                            <div style={{
                                display: 'flex' ,
                                flexDirection: 'column',
                                height: '100%',
                                overflow: 'auto'
                            }}>

                                <div className="p-1 border-top">

                                    <TagTree tags={this.state.tags}
                                             treeState={this.treeState}
                                             rootTitle="Documents"
                                             noCreate={true}/>

                                    {/*<TagList tags={this.state.tags}/>*/}

                                </div>

                            </div>
                        }
                        right={

                            <DocRepoTable columns={this.state.columns}
                                          selected={this.state.selected}
                                          data={this.state.data}
                                          relatedTags={this.props.repoDocMetaManager!.relatedTags}
                                          synchronizingDocLoader={this.synchronizingDocLoader}
                                          tagsProvider={() => tagsProvider()}
                                          writeDocInfoTags={(repoDocInfo, tags) => this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags)}
                                          deleteDocInfo={repoDocInfo => this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo)}
                                          writeDocInfoTitle={(repoDocInfo, title) => this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)}
                                          writeDocInfo={docInfo => this.props.repoDocMetaManager.writeDocInfo(docInfo)}
                                          refresh={() => this.refresh()}
                                          onDocDeleteRequested={repoDocInfos => this.onDocDeleteRequested(repoDocInfos)}
                                          onDocDeleted={repoDocInfos => this.onDocDeleted(repoDocInfos)}
                                          onDocSetTitle={(repoDocInfo, title) => this.onDocSetTitle(repoDocInfo, title)}
                                          onDocTagged={(repoDocInfo, tags) => this.onDocTagged(repoDocInfo, tags)}
                                          onMultiDeleted={() => this.onMultiDeleted()}
                                          selectRow={(selectedIdx, event1, checkbox) => this.selectRow(selectedIdx, event1, checkbox)}
                                          onSelected={selected => this.onSelected(selected)}
                                          onReactTable={reactTable => this.reactTable = reactTable}/>
                        }
                        side='left'
                        initialWidth={300}/>


                </FixedNav>
            </div>

        );
    }

    private async onDocTagged(repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) {

        RendererAnalytics.event({category: 'user', action: 'doc-tagged'});

        await this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        this.refresh();

    }

    private onDocDeleteRequested(...repoDocInfos: RepoDocInfo[]) {

        Dialogs.confirm({
            title: "Are you sure you want to delete these document(s)?",
            subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
            onCancel: NULL_FUNCTION,
            onConfirm: () => this.onDocDeleted(...repoDocInfos),
        });

    }

    private onDocDeleted(...repoDocInfos: RepoDocInfo[]) {

        const doDeletes = async () => {

            const stats = {
                successes: 0,
                failures: 0
            };

            this.clearSelected();

            const progressTracker = new ProgressTracker(repoDocInfos.length, 'delete');

            for (const repoDocInfo of repoDocInfos) {

                log.info("Deleting document: ", repoDocInfo);

                try {

                    await this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo);
                    ++stats.successes;
                    this.refresh();

                } catch (e) {
                    ++stats.failures;
                    log.error("Could not delete doc: " , e);
                } finally {
                    const progress = progressTracker.incr();
                    ProgressMessages.broadcast(progress);
                }

            }

            this.clearSelected();

            if (stats.failures === 0) {
                Toaster.success(`${stats.successes} documents successfully deleted.`);
            } else {
                Toaster.error(`Failed to delete ${stats.failures} with ${stats.successes} successful.`);
            }

        };

        doDeletes()
            .catch(err => log.error("Unable to delete files: ", err));

    }

    private onDocSetTitle(repoDocInfo: RepoDocInfo, title: string) {

        RendererAnalytics.event({category: 'user', action: 'set-doc-title'});

        log.info("Setting doc title: " , title);

        this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));

        this.refresh();

    }

    private onSelectedColumns(columns: ListOptionType[]) {

        RendererAnalytics.event({category: 'user', action: 'selected-columns'});

        // new columns have been selected. Note that the UI updates the values
        // directly so we can just write what's in memory to disk. I think it
        // would be better practice to keep them immutable.

        SettingsStore.load()
            .then((settingsProvider) => {

                const currentSettings = settingsProvider();

                const settings: Settings = {
                    ...currentSettings,
                    documentRepository: {
                        columns: this.state.columns
                    }
                };

                SettingsStore.write(settings)
                    .catch(err => log.error(err));

            })
            .catch(err => log.error("Could not load settings: ", err));

        this.refresh();
    }


    private onFilterByTitle(title: string) {
        RendererAnalytics.event({category: 'user', action: 'filter-by-title'});
        this.docRepoFilters.onFilterByTitle(title);
    }

    private refresh() {
        this.docRepoFilters.refresh();
    }

    /**
     * Perform the actual refresh.
     */
    private doRefresh(data: ReadonlyArray<RepoDocInfo>) {

        const tags = this.props.repoDocMetaManager.repoDocInfoIndex.toTagDescriptors();

        const state = {...this.state, data, tags};

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

        }, 1);

    }

    private onToggleFlaggedOnly(value: boolean) {
        this.docRepoFilters.onToggleFlaggedOnly(value);
    }

    private onToggleFilterArchived(value: boolean) {
        this.docRepoFilters.onToggleFilterArchived(value);
    }

}

interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

}

interface IState {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly columns: DocRepoTableColumns;
    readonly selected: ReadonlyArray<number>;
}


