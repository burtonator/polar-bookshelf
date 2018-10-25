"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_table_1 = __importDefault(require("react-table"));
const Utils_1 = require("./Utils");
const Logger_1 = require("../../../web/js/logger/Logger");
const DocLoader_1 = require("../../../web/js/apps/main/ipc/DocLoader");
const Strings_1 = require("../../../web/js/util/Strings");
const RepoDocInfoLoader_1 = require("./RepoDocInfoLoader");
const RepoDocInfos_1 = require("./RepoDocInfos");
const DocRepository_1 = require("./DocRepository");
const TagInput_1 = require("./TagInput");
const Optional_1 = require("../../../web/js/util/ts/Optional");
const FilterTagInput_1 = require("./FilterTagInput");
const FilteredTags_1 = require("./FilteredTags");
const Preconditions_1 = require("../../../web/js/Preconditions");
const Sets_1 = require("../../../web/js/util/Sets");
const Tags_1 = require("../../../web/js/tags/Tags");
const DateTimeTableCell_1 = require("./DateTimeTableCell");
const RendererAnalytics_1 = require("../../../web/js/ga/RendererAnalytics");
const MessageBanner_1 = require("./MessageBanner");
const DocDropdown_1 = require("./DocDropdown");
const TableDropdown_1 = require("./TableDropdown");
const TableColumns_1 = require("./TableColumns");
const SettingsStore_1 = require("../../../web/js/datastore/SettingsStore");
const log = Logger_1.Logger.create();
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.filteredTags = new FilteredTags_1.FilteredTags();
        this.persistenceLayer = props.persistenceLayer;
        this.docRepository = new DocRepository_1.DocRepository(this.persistenceLayer);
        this.repoDocInfoLoader = new RepoDocInfoLoader_1.RepoDocInfoLoader(this.persistenceLayer);
        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);
        this.state = {
            data: [],
            columns: new TableColumns_1.TableColumns()
        };
        (() => __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            this.refresh();
        }))().catch(err => log.error("Could not load disk store: ", err));
    }
    refresh() {
        this.refreshState(this.filterRepoDocInfos(Object.values(this.docRepository.repoDocs)));
    }
    highlightRow(selected) {
        const state = Object.assign({}, this.state);
        state.selected = selected;
        this.setState(state);
    }
    render() {
        const { data } = this.state;
        return (React.createElement("div", { id: "doc-repository" },
            React.createElement("header", null,
                React.createElement("div", { id: "header-logo" },
                    React.createElement("img", { src: "./img/icon.svg", height: "25" })),
                React.createElement("div", { id: "header-title" },
                    React.createElement("h1", null, "Document Repository")),
                React.createElement("div", { id: "header-filter" },
                    React.createElement("div", { className: "header-filter-boxes" },
                        React.createElement("div", { className: "header-filter-box" },
                            React.createElement("div", { className: "checkbox-group" },
                                React.createElement("input", { id: "filter_flagged", type: "checkbox", className: "header-filter-clickable", onChange: () => this.refresh() }),
                                React.createElement("label", { className: "header-filter-clickable", htmlFor: "filter_flagged" }, "flagged only"))),
                        React.createElement("div", { className: "header-filter-box" },
                            React.createElement("div", { className: "checkbox-group" },
                                React.createElement("input", { id: "filter_archived", defaultChecked: true, type: "checkbox", className: "header-filter-clickable", onChange: () => this.refresh() }),
                                React.createElement("label", { className: "header-filter-clickable", htmlFor: "filter_archived" }, "hide archived"))),
                        React.createElement("div", { className: "header-filter-box header-filter-tags" },
                            React.createElement(FilterTagInput_1.FilterTagInput, { tagsDBProvider: () => this.docRepository.tagsDB, refresher: () => this.refresh(), filteredTags: this.filteredTags })),
                        React.createElement("div", { className: "header-filter-box" },
                            React.createElement("input", { id: "filter_title", type: "text", placeholder: "Filter by title", onChange: () => this.refresh() })),
                        React.createElement("div", { className: "p-1" },
                            React.createElement(TableDropdown_1.TableDropdown, { id: "table-dropdown", options: Object.values(this.state.columns), onSelectedColumns: () => this.onSelectedColumns() }))))),
            React.createElement(MessageBanner_1.MessageBanner, null),
            React.createElement("div", { id: "doc-table" },
                React.createElement(react_table_1.default, { data: data, columns: [
                        {
                            Header: 'Title',
                            accessor: 'title',
                            Cell: (row) => (React.createElement("div", {contentEditable: true,
                             style: {
                               background: data[row.index]['editing'] ? 'white' : 'unset',
                               color: data[row.index]['editing'] ? 'black' : 'unset'

                             },
                             onBlur: (e) => {
                              const data = [...this.state.data];
                              data[row.index][row.column.id] = e.target.innerHTML;
                              data[row.index]['editing'] = false
                              this.setState({ data });
                              this.onDocSetTitle(this.state.data[row.index], e.target.innerHTML)
                            },
                            onClick: (e) => {
                              const data = [...this.state.data];
                              data[row.index]['editing'] = true
                              this.setState({ data });
                            },
                            dangerouslySetInnerHTML: {
                              __html: this.state.data[row.index][row.column.id]
                            },
                          },))
                        },
                        {
                            Header: 'Last Updated',
                            accessor: 'lastUpdated',
                            show: this.state.columns.lastUpdated.selected,
                            maxWidth: 125,
                            defaultSortDesc: true,
                            Cell: (row) => (React.createElement(DateTimeTableCell_1.DateTimeTableCell, { className: "doc-col-last-updated", datetime: row.value }))
                        },
                        {
                            Header: 'Added',
                            accessor: 'added',
                            show: this.state.columns.added.selected,
                            maxWidth: 125,
                            defaultSortDesc: true,
                            Cell: (row) => (React.createElement(DateTimeTableCell_1.DateTimeTableCell, { className: "doc-col-added", datetime: row.value }))
                        },
                        {
                            id: 'tags',
                            Header: 'Tags',
                            accessor: '',
                            show: this.state.columns.tags.selected,
                            Cell: (row) => {
                                const tags = row.original.tags;
                                const formatted = Object.values(tags)
                                    .map(tag => tag.label)
                                    .sort()
                                    .join(", ");
                                return (React.createElement("div", null, formatted));
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
                            Cell: (row) => (React.createElement("progress", { max: "100", value: row.value, style: {
                                    width: '100%'
                                } }))
                        },
                        {
                            id: 'tag-input',
                            Header: '',
                            accessor: '',
                            maxWidth: 25,
                            defaultSortDesc: true,
                            resizable: false,
                            Cell: (row) => {
                                const repoDocInfo = row.original;
                                const existingTags = Object.values(Optional_1.Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));
                                return (React.createElement(TagInput_1.TagInput, { repoDocInfo: repoDocInfo, tagsDB: this.docRepository.tagsDB, existingTags: existingTags, onChange: (_, tags) => this.onDocTagged(repoDocInfo, tags)
                                        .catch(err => log.error("Unable to update tags: ", err)) }));
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
                            Cell: (row) => {
                                const title = 'Flag document';
                                if (row.original.flagged) {
                                    return (React.createElement("i", { className: "fa fa-flag doc-button doc-button-active", title: title }));
                                }
                                else {
                                    return (React.createElement("i", { className: "fa fa-flag doc-button doc-button-inactive", title: title }));
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
                            Cell: (row) => {
                                const title = 'Archive document';
                                const uiClassName = row.original.archived ? 'doc-button-active' : 'doc-button-inactive';
                                const className = `fa fa-check doc-button ${uiClassName}`;
                                return (React.createElement("i", { className: className, title: title }));
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
                            Cell: (row) => {
                                const repoDocInfo = row.original;
                                return (React.createElement(DocDropdown_1.DocDropdown, { id: 'doc-dropdown-' + row.index, repoDocInfo: repoDocInfo, onDelete: this.onDocDeleted, onSetTitle: this.onDocSetTitle }));
                            }
                        }
                    ], defaultPageSize: 25, noDataText: "No documents available.", className: "-striped -highlight", defaultSorted: [
                        {
                            id: "progress",
                            desc: true
                        }
                    ], getTrProps: (state, rowInfo) => {
                        return {
                            onClick: (e) => {
                                this.highlightRow(rowInfo.index);
                            },
                            style: {
                                background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black',
                            }
                        };
                    }, getTdProps: (state, rowInfo, column, instance) => {
                        const singleClickColumns = ['tag-input', 'flagged', 'archived', 'doc-dropdown'];
                        if (!singleClickColumns.includes(column.id)) {
                            return {
                                onDoubleClick: (e) => {
                                    this.onDocumentLoadRequested(rowInfo.original.fingerprint, rowInfo.original.filename);
                                }
                            };
                        }
                        if (singleClickColumns.includes(column.id)) {
                            return {
                                onClick: ((e, handleOriginal) => {
                                    this.handleToggleField(rowInfo.original, column.id)
                                        .catch(err => log.error("Could not handle toggle: ", err));
                                    if (handleOriginal) {
                                        handleOriginal();
                                    }
                                })
                            };
                        }
                        return {};
                    } }),
                React.createElement("br", null),
                React.createElement(Utils_1.Tips, null),
                React.createElement(Utils_1.Footer, null))));
    }
    onDocTagged(repoDocInfo, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.docRepository.syncDocInfoTags(repoDocInfo, tags);
            this.refresh();
        });
    }
    onDocDeleted(repoDocInfo) {
        log.info("Deleting document: ", repoDocInfo);
        this.docRepository.syncDeleteDocInfo(repoDocInfo)
            .catch(err => log.error("Could not delete doc: ", err));
        this.refresh();
    }
    onDocSetTitle(repoDocInfo, title) {
        log.info("Setting doc title: ", title);
        this.docRepository.syncDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));
        this.refresh();
    }
    onSelectedColumns() {
        SettingsStore_1.SettingsStore.load().then((settings) => {
            settings.documentRepository.columns = this.state.columns;
            SettingsStore_1.SettingsStore.write(settings);
        });
        this.refresh();
    }
    refreshState(repoDocs) {
        const state = Object.assign({}, this.state);
        state.data = repoDocs;
        setTimeout(() => {
            this.setState(state);
        }, 0);
    }
    filterRepoDocInfos(repoDocs) {
        repoDocs = this.doFilterValid(repoDocs);
        repoDocs = this.doFilterByTitle(repoDocs);
        repoDocs = this.doFilterFlaggedOnly(repoDocs);
        repoDocs = this.doFilterHideArchived(repoDocs);
        repoDocs = this.doFilterByTags(repoDocs);
        return repoDocs;
    }
    doFilterValid(repoDocs) {
        return repoDocs.filter(current => RepoDocInfos_1.RepoDocInfos.isValid(current));
    }
    doFilterByTitle(repoDocs) {
        const filterElement = document.querySelector("#filter_title");
        const filterText = filterElement.value;
        if (!Strings_1.Strings.empty(filterText)) {
            return repoDocs.filter(current => current.title &&
                current.title.toLowerCase().indexOf(filterText.toLowerCase()) >= 0);
        }
        return repoDocs;
    }
    doFilterFlaggedOnly(repoDocs) {
        const filterElement = document.querySelector("#filter_flagged");
        if (filterElement.checked) {
            return repoDocs.filter(current => current.flagged);
        }
        return repoDocs;
    }
    doFilterHideArchived(repoDocs) {
        const filterElement = document.querySelector("#filter_archived");
        if (filterElement.checked) {
            log.info("Applying archived filter");
            return repoDocs.filter(current => !current.archived);
        }
        return repoDocs;
    }
    doFilterByTags(repoDocs) {
        const tags = Tags_1.Tags.toIDs(this.filteredTags.get());
        return repoDocs.filter(current => {
            if (tags.length === 0) {
                return true;
            }
            if (!Preconditions_1.isPresent(current.docInfo.tags)) {
                return false;
            }
            const intersection = Sets_1.Sets.intersection(tags, Tags_1.Tags.toIDs(Object.values(current.docInfo.tags)));
            return intersection.length === tags.length;
        });
    }
    onDocumentLoadRequested(fingerprint, filename) {
        DocLoader_1.DocLoader.load({
            fingerprint,
            filename,
            newWindow: true
        }).catch(err => log.error("Unable to load doc: ", err));
    }
    handleToggleField(repoDocInfo, field) {
        return __awaiter(this, void 0, void 0, function* () {
            if (field === 'archived') {
                RendererAnalytics_1.RendererAnalytics.event({ category: 'user', action: 'archived-doc' });
                repoDocInfo.archived = !repoDocInfo.archived;
                repoDocInfo.docInfo.archived = repoDocInfo.archived;
            }
            if (field === 'flagged') {
                RendererAnalytics_1.RendererAnalytics.event({ category: 'user', action: 'flagged-doc' });
                repoDocInfo.flagged = !repoDocInfo.flagged;
                repoDocInfo.docInfo.flagged = repoDocInfo.flagged;
            }
            yield this.docRepository.syncDocInfo(repoDocInfo.docInfo);
            this.refresh();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield SettingsStore_1.SettingsStore.load();
            log.info("Settings loaded: ", settings);
            Optional_1.Optional.of(settings.documentRepository)
                .map(current => current.columns)
                .when(columns => {
                log.info("Loaded columns from settings: ", columns);
                this.setState(Object.assign(this.state, { columns }));
                this.refresh();
            });
            this.persistenceLayer.addEventListener((event) => {
                log.info("Received DocInfo update");
                const repoDocInfo = RepoDocInfos_1.RepoDocInfos.convertFromDocInfo(event.docInfo);
                if (RepoDocInfos_1.RepoDocInfos.isValid(repoDocInfo)) {
                    this.docRepository.updateDocInfo(repoDocInfo);
                    this.refresh();
                }
                else {
                    log.warn("We were given an invalid DocInfo which yielded a broken RepoDocInfo: ", event.docInfo, repoDocInfo);
                }
            });
            const repoDocs = yield this.repoDocInfoLoader.load();
            RendererAnalytics_1.RendererAnalytics.set({ 'nrDocs': Object.keys(repoDocs).length });
            this.docRepository.updateDocInfo(...Object.values(repoDocs));
        });
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map

