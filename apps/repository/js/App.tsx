import * as React from 'react';
import { cursorTo } from 'readline';
import ReactTable from "react-table";
import { AppState } from './AppState';
import { AppProps } from './AppProps';
import { TagInput } from './TagInput';
import { Footer, Tips } from './Utils';
import { RepoDocInfo } from './RepoDocInfo';
import { DocDropdown } from './DocDropdown';
import { RepoDocInfos } from './RepoDocInfos';
import { TableColumns } from './TableColumns';
import { FilteredTags } from './FilteredTags';
import CookieBanner from 'react-cookie-banner';
import { Tag } from '../../../web/js/tags/Tag';
import { TableDropdown } from './TableDropdown';
import { DocRepository } from './DocRepository';
import { MessageBanner } from './MessageBanner';
import { Tags } from '../../../web/js/tags/Tags';
import { Sets } from '../../../web/js/util/Sets';
import { FilterTagInput } from './FilterTagInput';
import { Strings } from '../../../web/js/util/Strings';
import { Logger } from '../../../web/js/logger/Logger';
import { RepoDocInfoLoader } from './RepoDocInfoLoader';
import { DateTimeTableCell } from './DateTimeTableCell';
import { isPresent } from '../../../web/js/Preconditions';
import { Optional } from '../../../web/js/util/ts/Optional';
import { DocLoader } from '../../../web/js/apps/main/ipc/DocLoader';
import { SettingsStore } from '../../../web/js/datastore/SettingsStore';
import { RendererAnalytics } from '../../../web/js/ga/RendererAnalytics';
import { IListenablePersistenceLayer } from '../../../web/js/datastore/IListenablePersistenceLayer';

const log = Logger.create();

export default class App extends React.Component<AppProps, AppState> {

  private readonly docRepository: DocRepository;
  private readonly filteredTags = new FilteredTags();
  private readonly repoDocInfoLoader: RepoDocInfoLoader;
  private readonly persistenceLayer: IListenablePersistenceLayer;

  constructor(props: AppProps, context: any) {
    super(props, context);
    this.persistenceLayer = props.persistenceLayer;
    this.docRepository = new DocRepository(this.persistenceLayer);
    this.repoDocInfoLoader = new RepoDocInfoLoader(this.persistenceLayer);
    this.onDocTagged = this.onDocTagged.bind(this);
    this.onDocDeleted = this.onDocDeleted.bind(this);
    this.onDocSetTitle = this.onDocSetTitle.bind(this);
    this.onSelectedColumns = this.onSelectedColumns.bind(this);

    this.state = {
      data: [],
      columns: new TableColumns()
    };

    (async () => {
      await this.init();
      this.refresh();
    })().catch(err => log.error("Could not load disk store: ", err));

  }

  public refresh() {
    this.refreshState(this.filterRepoDocInfos(Object.values(this.docRepository!.repoDocs)));
  }

  public highlightRow(selected: number) {
    const state: AppState = Object.assign({}, this.state);
    state.selected = selected;
    this.setState(state);
  }

  public render() {
    const { data } = this.state;
    console.log(this.state)
    return (
      <div id="doc-repository">
        <header>
          <div id="header-logo">
            <img src="./img/icon.svg" height="25" />
          </div>
          <div id="header-title">
            <h1>Document Repository</h1>
          </div>
          <div id="header-filter">
            <div className="header-filter-boxes">
              <div className="header-filter-box">
                <div className="checkbox-group">
                  <input id="filter_flagged"
                    type="checkbox"
                    className="header-filter-clickable"
                    onChange={() => this.refresh()} />
                  <label className="header-filter-clickable"
                    htmlFor="filter_flagged">flagged only</label>
                </div>
              </div>
              <div className="header-filter-box">
                <div className="checkbox-group">
                  <input id="filter_archived"
                    defaultChecked
                    type="checkbox"
                    className="header-filter-clickable"
                    onChange={() => this.refresh()} />
                  <label className="header-filter-clickable"
                    htmlFor="filter_archived">hide archived</label>
                </div>
              </div>
              <div className="header-filter-box header-filter-tags">
                <FilterTagInput tagsDBProvider={() => this.docRepository!.tagsDB}
                  refresher={() => this.refresh()}
                  filteredTags={this.filteredTags} />
              </div>
              <div className="header-filter-box">
                <input id="filter_title"
                  type="text"
                  placeholder="Filter by title"
                  onChange={() => this.refresh()} />
              </div>
              <div className="p-1">
                <TableDropdown id="table-dropdown"
                  options={Object.values(this.state.columns)}
                  onSelectedColumns={() => this.onSelectedColumns()} />
              </div>
            </div>
          </div>
        </header>
        <MessageBanner />
        <div id="doc-table">
          <ReactTable
            data={data}
            columns={
              [
                {
                  Header: 'Title',
                  accessor: 'title',
                  Cell: (row) => (React.createElement("div", {
                    contentEditable: false,
                    style: {
                      background: data[row.index]['editing'] ? 'white' : 'unset',
                      color: data[row.index]['editing'] ? 'black' : 'unset'
                    },
                    onBlur: (e) => {
                      const data = [...this.state.data];
                      data[row.index][row.column.id] = e.target.innerHTML;
                      data[row.index]['editing'] = false
                      this.onDocSetTitle(this.state.data[row.index], e.target.innerHTML)
                      this.setState({ data });
                      e.target.contentEditable = false
                      e.target.blur()
                    },
                    onContextMenu: (e) => {
                      const data = [...this.state.data];
                      if (!data[row.index]['editing']) {
                        data[row.index]['editing'] = true
                        e.target.contentEditable = true
                        e.target.focus()
                        this.setState({ data });
                      } else {
                        data[row.index]['editing'] = false
                        this.setState({ data });
                        e.target.contentEditable = false
                      }
                    },
                    dangerouslySetInnerHTML: {
                      __html: this.state.data[row.index][row.column.id]
                    },
                  },
                  ))
                },
                {
                  Header: 'Last Updated',
                  // accessor: (row: any) => row.added,
                  accessor: 'lastUpdated',
                  show: this.state.columns.lastUpdated.selected,
                  maxWidth: 125,
                  defaultSortDesc: true,
                  Cell: (row: any) => (
                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.value} />
                  )

                },
                {
                  Header: 'Added',
                  accessor: 'added',
                  show: this.state.columns.added.selected,
                  maxWidth: 125,
                  defaultSortDesc: true,
                  Cell: (row: any) => (
                    <DateTimeTableCell className="doc-col-added" datetime={row.value} />
                  )
                },
                {
                  id: 'tags',
                  Header: 'Tags',
                  accessor: '',
                  show: this.state.columns.tags.selected,
                  Cell: (row: any) => {
                    const tags: { [id: string]: Tag } = row.original.tags;
                    const formatted = Object.values(tags)
                      .map(tag => tag.label)
                      .sort()
                      .join(", ");
                    return (
                      <div>{formatted}</div>
                    );

                  }
                },
                {
                  id: 'nrAnnotations',
                  Header: 'Annotations',
                  accessor: 'nrAnnotations',
                  maxWidth: 110,
                  show: this.state.columns.nrAnnotations.selected,
                  defaultSortDesc: true,
                  resizable: false,
                },
                {
                  id: 'progress',
                  Header: 'Progress',
                  accessor: 'progress',
                  show: this.state.columns.progress.selected,
                  maxWidth: 150,
                  defaultSortDesc: true,
                  resizable: false,
                  Cell: (row: any) => (

                    <progress max="100" value={row.value} style={{
                      width: '100%'
                    }} />
                  )
                },
                {
                  id: 'tag-input',
                  Header: '',
                  accessor: '',
                  maxWidth: 25,
                  defaultSortDesc: true,
                  resizable: false,
                  Cell: (row: any) => {

                    const repoDocInfo: RepoDocInfo = row.original;

                    const existingTags: Tag[]
                      = Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));

                    return (
                      <TagInput repoDocInfo={repoDocInfo}
                        tagsDB={this.docRepository!.tagsDB}
                        existingTags={existingTags}
                        onChange={(_, tags) =>
                          this.onDocTagged(repoDocInfo, tags)
                            .catch(err => log.error("Unable to update tags: ", err))} />
                    );

                  }
                },
                {
                  id: 'flagged',
                  Header: '',
                  accessor: 'flagged',
                  show: this.state.columns.flagged.selected,
                  maxWidth: 25,
                  defaultSortDesc: true,
                  resizable: false,
                  Cell: (row: any) => {
                    const title = 'Flag document';
                    if (row.original.flagged) {
                      return (
                        <i className="fa fa-flag doc-button doc-button-active" title={title} />
                      );
                    } else {
                      return (
                        <i className="fa fa-flag doc-button doc-button-inactive" title={title} />
                      );
                    }

                  }
                },
                {
                  id: 'archived',
                  Header: '',
                  accessor: 'archived',
                  show: this.state.columns.archived.selected,
                  maxWidth: 25,
                  defaultSortDesc: true,
                  resizable: false,
                  Cell: (row: any) => {
                    const title = 'Archive document';
                    const uiClassName = row.original.archived ? 'doc-button-active' : 'doc-button-inactive';
                    const className = `fa fa-check doc-button ${uiClassName}`;
                    return (
                      <i className={className} title={title} />
                    );

                  }
                },
                {
                  id: 'doc-dropdown',
                  Header: '',
                  accessor: '',
                  maxWidth: 25,
                  defaultSortDesc: true,
                  resizable: false,
                  sortable: false,
                  className: 'doc-dropdown',
                  Cell: (row: any) => {
                    const repoDocInfo: RepoDocInfo = row.original;
                    return (
                      <DocDropdown id={'doc-dropdown-' + row.index}
                        repoDocInfo={repoDocInfo}
                        onDelete={this.onDocDeleted}
                        onSetTitle={this.onDocSetTitle} />
                    );
                  }
                }
              ]}
            defaultPageSize={25}
            noDataText="No documents available."
            className="-striped -highlight"
            defaultSorted={[
              {
                id: "progress",
                desc: true
              }
            ]}
            getTrProps={(state: any, rowInfo: any) => {
              return {
                onClick: (e: any) => {
                  this.highlightRow(rowInfo.index as number);
                },
                onContextMenu: (e: any) => {
                  this.highlightRow(rowInfo.index as number);
                },
                style: {
                  background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',
                  color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black',
                }
              };
            }}
            getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

              const singleClickColumns = ['tag-input', 'flagged', 'archived', 'doc-dropdown'];

              if (!singleClickColumns.includes(column.id)) {
                return {
                  onDoubleClick: (e: any) => {
                    var selection = window.getSelection ? window.getSelection() : undefined
                    if (selection) selection.empty()
                    e.target.blur();
                    rowInfo.original.contenteditable = false
                    this.onDocumentLoadRequested(rowInfo.original.fingerprint, rowInfo.original.filename);
                  }
                };
              }

              if (singleClickColumns.includes(column.id)) {
                return {
                  onClick: ((e: any, handleOriginal?: () => void) => {
                    this.handleToggleField(rowInfo.original, column.id)
                      .catch(err => log.error("Could not handle toggle: ", err));
                    if (handleOriginal) {
                      // needed for react table to function
                      // properly.
                      handleOriginal();
                    }
                  })
                };
              }
              return {};
            }}
          />
          <br />
          <Tips />
          <Footer />
        </div>
      </div>

    );
  }

  private async onDocTagged(repoDocInfo: RepoDocInfo, tags: Tag[]) {
    RendererAnalytics.event({ category: 'user', action: 'doc-tagged' });
    await this.docRepository!.syncDocInfoTags(repoDocInfo, tags);
    this.refresh();
  }

  private onDocDeleted(repoDocInfo: RepoDocInfo) {
    RendererAnalytics.event({ category: 'user', action: 'doc-deleted' });
    log.info("Deleting document: ", repoDocInfo)
    this.docRepository.syncDeleteDocInfo(repoDocInfo)
      .catch(err => log.error("Could not delete doc: ", err));
    this.refresh();
  }

  private onDocSetTitle(repoDocInfo: RepoDocInfo, title: string) {
    RendererAnalytics.event({ category: 'user', action: 'set-doc-title' });
    log.info("Setting doc title: ", title);
    this.docRepository.syncDocInfoTitle(repoDocInfo, title)
      .catch(err => log.error("Could not write doc title: ", err));
    // this.refresh();

  }

  private onSelectedColumns() {
    RendererAnalytics.event({ category: 'user', action: 'selected-columns' });
    // new columns have been selected. Note that the UI updates the values
    // directly so we can just write what's in memory to disk. I think it
    // would be better practice to keep them immutable.
    SettingsStore.load().then((settings) => {
      settings.documentRepository.columns = this.state.columns;
      SettingsStore.write(settings);
    });
    this.refresh();
  }

  private refreshState(repoDocs: RepoDocInfo[]) {
    const state: AppState = Object.assign({}, this.state);
    state.data = repoDocs;
    setTimeout(() => {
      // The react table will not update when I change the state from
      // within the event listener
      this.setState(state);
    }, 0);
  }

  private filterRepoDocInfos(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    // always filter valid to make sure nothing corrupts the state.  Some
    // other bug might inject a problem otherwise.
    repoDocs = this.doFilterValid(repoDocs);
    repoDocs = this.doFilterByTitle(repoDocs);
    repoDocs = this.doFilterFlaggedOnly(repoDocs);
    repoDocs = this.doFilterHideArchived(repoDocs);
    repoDocs = this.doFilterByTags(repoDocs);
    return repoDocs;
  }

  private doFilterValid(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    return repoDocs.filter(current => RepoDocInfos.isValid(current));
  }

  private doFilterByTitle(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    const filterElement = document.querySelector("#filter_title") as HTMLInputElement;
    const filterText = filterElement.value;
    if (!Strings.empty(filterText)) {
      return repoDocs.filter(current => current.title &&
        current.title.toLowerCase().indexOf(filterText!.toLowerCase()) >= 0);
    }
    return repoDocs;
  }

  private doFilterFlaggedOnly(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    const filterElement = document.querySelector("#filter_flagged") as HTMLInputElement;
    if (filterElement.checked) {
      return repoDocs.filter(current => current.flagged);
    }
    return repoDocs;
  }

  private doFilterHideArchived(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    const filterElement = document.querySelector("#filter_archived") as HTMLInputElement;
    if (filterElement.checked) {
      log.info("Applying archived filter");
      return repoDocs.filter(current => !current.archived);
    }
    return repoDocs;
  }

  private doFilterByTags(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
    RendererAnalytics.event({ category: 'user', action: 'filter-by-tags' });
    const tags = Tags.toIDs(this.filteredTags.get());
    return repoDocs.filter(current => {
      if (tags.length === 0) {
        // there is no filter in place...
        return true;
      }
      if (!isPresent(current.docInfo.tags)) {
        // the document we're searching over has not tags.
        return false;
      }
      const intersection =
        Sets.intersection(tags, Tags.toIDs(Object.values(current.docInfo.tags!)));
      return intersection.length === tags.length;
    });
  }

  private onDocumentLoadRequested(fingerprint: string, filename: string) {
    DocLoader.load({
      fingerprint,
      filename,
      newWindow: true
    }).catch(err => log.error("Unable to load doc: ", err));
  }

  private async handleToggleField(repoDocInfo: RepoDocInfo, field: string) {
    // TODO: move to syncDocInfoArchived in DocRepository
    if (field === 'archived') {
      RendererAnalytics.event({ category: 'user', action: 'archived-doc' });
      repoDocInfo.archived = !repoDocInfo.archived;
      repoDocInfo.docInfo.archived = repoDocInfo.archived;
    }
    if (field === 'flagged') {
      RendererAnalytics.event({ category: 'user', action: 'flagged-doc' });
      repoDocInfo.flagged = !repoDocInfo.flagged;
      repoDocInfo.docInfo.flagged = repoDocInfo.flagged;
    }
    await this.docRepository!.syncDocInfo(repoDocInfo.docInfo);
    this.refresh();
  }

  private async init(): Promise<void> {
    const settings = await SettingsStore.load();
    log.info("Settings loaded: ", settings);
    Optional.of(settings.documentRepository)
      .map(current => current.columns)
      .when(columns => {
        log.info("Loaded columns from settings: ", columns);
        this.setState(Object.assign(this.state, { columns }));
        this.refresh();
      });

    this.persistenceLayer.addEventListener((event) => {
      log.info("Received DocInfo update");
      const repoDocInfo = RepoDocInfos.convertFromDocInfo(event.docInfo);
      if (RepoDocInfos.isValid(repoDocInfo)) {
        this.docRepository!.updateDocInfo(repoDocInfo);
        this.refresh();
      } else {
        log.warn("We were given an invalid DocInfo which yielded a broken RepoDocInfo: ",
          event.docInfo, repoDocInfo);
      }
    });
    const repoDocs = await this.repoDocInfoLoader!.load();
    RendererAnalytics.set({ 'nrDocs': Object.keys(repoDocs).length });
    this.docRepository.updateDocInfo(...Object.values(repoDocs));
  }
}
