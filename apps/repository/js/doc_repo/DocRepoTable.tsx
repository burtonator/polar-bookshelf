import * as React from 'react';
import ReactTable, {ColumnRenderProps, Instance, Column, RowInfo} from "react-table";
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocInfo} from '../RepoDocInfo';
import {TagInput} from '../TagInput';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag, Tags} from '../../../../web/js/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {DocDropdown} from '../DocDropdown';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocButton} from '../ui/DocButton';
import {FlagDocButton} from '../ui/FlagDocButton';
import {ArchiveDocButton} from '../ui/ArchiveDocButton';
import Input from 'reactstrap/lib/Input';
import {DocContextMenu} from '../DocContextMenu';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {Either} from '../../../../web/js/util/Either';
import {BackendFileRefs} from '../../../../web/js/datastore/BackendFileRefs';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {RelatedTags} from '../../../../web/js/tags/related/RelatedTags';
import {AccountUpgradeBar} from "../../../../web/js/ui/account_upgrade/AccountUpgradeBar";
import {Platforms} from "../../../../web/js/util/Platforms";
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

// TODO: go back to ExtendedReactTable


export class DocRepoTable extends ReleasingReactComponent<IProps, IState> {

    private contextMenuProps: any;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.contextMenuProps = {
            onDelete: this.props.onDocDeleteRequested,
            onSetTitle: this.props.onDocSetTitle,
            onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => {
                this.onDocumentLoadRequested(repoDocInfo);
            }
        };


        this.createColumnCheckbox = this.createColumnCheckbox.bind(this);
        this.createColumnTitle = this.createColumnTitle.bind(this);
        this.createColumnUpdated = this.createColumnUpdated.bind(this);
        this.createColumnAdded = this.createColumnAdded.bind(this);
        this.createColumnSite = this.createColumnSite.bind(this);
        this.createColumnTags = this.createColumnTags.bind(this);
        this.createColumnProgress = this.createColumnProgress.bind(this);
        this.createColumnAnnotations = this.createColumnAnnotations.bind(this);
        this.createColumnButtons = this.createColumnButtons.bind(this);

        this.createColumns = this.createColumns.bind(this);
        this.createColumnsForTablet = this.createColumnsForTablet.bind(this);
        this.createColumnsForDesktop = this.createColumnsForDesktop.bind(this);


        this.createCellProps = this.createCellProps.bind(this);
        this.createCellPropsForMobile = this.createCellPropsForMobile.bind(this);
        this.createCellPropsForDesktop = this.createCellPropsForDesktop.bind(this);

    }


    private createColumnCheckbox() {

        return {

            id: 'doc-checkbox',
            Header: (col: ColumnRenderProps) => {
                // TODO: move to a PureComponent to
                // improve performance

                const checked = this.props.selected.length === col.data.length && col.data.length > 0;

                return (<div>

                    <Input checked={checked}
                           style={{
                               marginLeft: 'auto',
                               marginRight: 'auto',
                               margin: 'auto',
                               position: 'relative',
                               top: '2px',
                               width: '16px',
                               height: '16px',
                           }}
                           className="m-auto"
                           onChange={NULL_FUNCTION}
                           onClick={() => {
                               // noop... now do we
                               // select ALL the
                               // items in the
                               // state now

                               const computeSelected = (): ReadonlyArray<number> => {

                                   if (this.props.selected.length !== col.data.length) {
                                       // all of
                                       // them
                                       return Numbers.range(0, col.data.length - 1);
                                   } else {
                                       // none of
                                       // them
                                       return [];
                                   }

                               };

                               const selected = computeSelected();

                               this.props.onSelected(selected);

                           }}
                           type="checkbox"/>

                </div>);
            },
            accessor: '',
            maxWidth: 25,
            defaultSortDesc: true,
            resizable: false,
            sortable: false,
            className: 'doc-checkbox',
            Cell: (row: any) => {
                // TODO: move to a PureComponent to
                // improve performance

                const viewIndex = row.viewIndex as number;

                return (<div style={{lineHeight: '1em'}}>

                    <Input checked={this.props.selected.includes(viewIndex)}
                           style={{
                               marginLeft: 'auto',
                               marginRight: 'auto',
                               margin: 'auto',
                               position: 'relative',
                               top: '2px',
                               width: '16px',
                               height: '16px',
                           }}
                           className="m-auto"
                           onChange={NULL_FUNCTION}
                           onClick={(event) => this.props.selectRow(viewIndex, event.nativeEvent, true)}
                           type="checkbox"/>

                    {/*<i className="far fa-square"></i>*/}

                </div>);
            }
        };

    }

    private createColumnTitle() {

        return {
            Header: 'Title',
            accessor: 'title',
            className: 'doc-table-col-title',
            Cell: (row: any) => {

                const id = 'doc-repo-row-title' + row.index;
                const repoDocInfo: RepoDocInfo = row.original;

                return (

                    <div id={id}>

                        <DocContextMenu {...this.contextMenuProps}
                                        id={'context-menu-' + row.index}
                                        repoDocInfo={repoDocInfo}>

                            <div>{row.value}</div>

                        </DocContextMenu>

                    </div>

                );
            }

        };

    }

    private createColumnUpdated() {

        return {
            Header: 'Updated',
            // accessor: (row: any) => row.added,
            headerClassName: "d-none-mobile",
            accessor: 'lastUpdated',
            show: this.props.columns.lastUpdated.selected,
            maxWidth: 85,
            defaultSortDesc: true,
            className: 'doc-table-col-updated d-none-mobile',
            Cell: (row: any) => {

                const repoDocInfo: RepoDocInfo = row.original;

                return (

                    <DocContextMenu {...this.contextMenuProps}
                                    id={'context-menu-' + row.index}
                                    repoDocInfo={repoDocInfo}>

                        <DateTimeTableCell className="doc-col-last-updated" datetime={row.value}/>

                    </DocContextMenu>

                );
            }

        };

    }

    private createColumnAdded() {

        return {
            Header: 'Added',
            accessor: 'added',
            headerClassName: "d-none-mobile",
            show: this.props.columns.added.selected,
            maxWidth: 85,
            defaultSortDesc: true,
            className: 'doc-table-col-added d-none-mobile',
            Cell: (row: any) => {

                const repoDocInfo: RepoDocInfo = row.original;

                return (

                    <DocContextMenu {...this.contextMenuProps}
                                    id={'context-menu-' + row.index}
                                    repoDocInfo={repoDocInfo}>

                        <DateTimeTableCell className="doc-col-added" datetime={row.value}/>

                    </DocContextMenu>

                );
            }
        };

    }

    private createColumnSite() {

        return {
            Header: 'Site',
            accessor: 'site',
            headerClassName: "d-none-mobile",
            show: (this.props.columns.site || {}).selected || false,
            // show: false,
            maxWidth: 200,
            sortable: false,
            className: "d-none-mobile",
            sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => {

                const toSTR = (doc?: RepoDocInfo): string => {

                    if (! doc) {
                        return "";
                    }

                    if (doc.site) {
                        return doc.site;
                    }

                    return "";

                };

                const aSTR = toSTR(a);
                const bSTR = toSTR(b);

                // if (aSTR === bSTR) {
                //     return 0;
                // }
                //
                // if (aSTR === "") {
                //     return Number.MIN_VALUE;
                // }
                //
                // if (bSTR === "") {
                //     return Number.MAX_VALUE;
                // }

                return aSTR.localeCompare(bSTR);

            },
        };

    }

    private createColumnTags() {
        return {
            id: 'tags',
            Header: 'Tags',
            headerClassName: "d-none-mobile",
            width: 250,
            accessor: '',
            show: this.props.columns.tags.selected,
            className: 'doc-table-col-tags d-none-mobile',
            sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => {

                const toSTR = (obj: any): string => {

                    if (! obj) {
                        return "";
                    }

                    if (typeof obj === 'string') {
                        return obj;
                    }

                    return JSON.stringify(obj);

                };

                const cmp = toSTR(a.tags).localeCompare(toSTR(b.tags));

                if (cmp !== 0) {
                    return cmp;
                }

                // for ties use the date added...
                return toSTR(a.added).localeCompare(toSTR(b.added));

            },
            Cell: (row: any) => {
                // TODO: move to a PureComponent to
                // improve performance

                const tags: {[id: string]: Tag} = row.original.tags;

                const formatted = Tags.onlyRegular(Object.values(tags))
                    .map(tag => tag.label)
                    .sort()
                    .join(", ");

                const repoDocInfo: RepoDocInfo = row.original;

                return (

                    <DocContextMenu {...this.contextMenuProps}
                                    id={'context-menu-' + row.index}
                                    repoDocInfo={repoDocInfo}>
                        <div>{formatted}</div>
                    </DocContextMenu>

                );

            }
        };
    }

    private createColumnProgress() {

        return {
            id: 'progress',
            Header: 'Progress',
            headerClassName: "d-none-mobile",
            accessor: 'progress',
            show: this.props.columns.progress.selected,
            maxWidth: 100,
            defaultSortDesc: true,
            resizable: false,
            className: 'doc-table-col-progress d-none-mobile',
            Cell: (row: any) => {

                const repoDocInfo: RepoDocInfo = row.original;

                return (

                    <DocContextMenu {...this.contextMenuProps}
                                    id={'context-menu-' + row.index}
                                    repoDocInfo={repoDocInfo}>

                        <progress className="mt-auto mb-auto" max="100" value={ row.value } style={{
                            width: '100%'
                        }} />

                    </DocContextMenu>

                );
            }
        };

    }

    private createColumnAnnotations() {

        return {
            id: 'nrAnnotations',
            Header: 'Annotations',
            headerClassName: "d-none-mobile",
            accessor: 'nrAnnotations',
            maxWidth: 110,
            show: this.props.columns.nrAnnotations.selected,
            defaultSortDesc: true,
            resizable: false,
            className: "d-none-mobile",
        };

    }

    private createColumnButtons() {

        return {
            id: 'doc-buttons',
            Header: '',
            headerClassName: "d-none-mobile",
            accessor: '',
            maxWidth: 100,
            defaultSortDesc: true,
            resizable: false,
            sortable: false,
            className: 'doc-dropdown d-none-mobile',
            Cell: (row: any) => {

                const repoDocInfo: RepoDocInfo = row.original;

                const existingTags: Tag[]
                    = Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));

                return (<div className="doc-buttons" style={{display: 'flex'}}>

                    <DocButton>

                        {/*WARNING: making this a function breaks the layout...*/}

                        <TagInput availableTags={this.props.tagsProvider()}
                                  existingTags={existingTags}
                                  relatedTags={this.props.relatedTags}
                                  onChange={(tags) => this.props.onDocTagged(repoDocInfo, tags)}/>

                    </DocButton>

                    <FlagDocButton active={repoDocInfo.flagged}
                                   onClick={() => this.doHandleToggleField(repoDocInfo, 'flagged')}/>

                    <ArchiveDocButton active={repoDocInfo.archived}
                                      onClick={() => this.doHandleToggleField(repoDocInfo, 'archived')}/>

                    <DocButton>

                        <DocDropdown id={'doc-dropdown-' + row.index}
                                     repoDocInfo={repoDocInfo}
                                     onDelete={this.props.onDocDeleteRequested}
                                     onSetTitle={this.props.onDocSetTitle}
                                     onDocumentLoadRequested={this.contextMenuProps.onDocumentLoadRequested}/>

                    </DocButton>

                </div>);

            }
        };

    }

    private createColumns() {

        if (Platforms.isMobile()) {
            return this.createColumnsForTablet();
        } else {
            return this.createColumnsForDesktop();
        }

    }

    private createColumnsForTablet() {

        return [
            this.createColumnCheckbox(),
            this.createColumnTitle(),
            // this.createColumnUpdated(),
            // this.createColumnAdded(),
            // this.createColumnSite(),
            // this.createColumnTags(),
            // this.createColumnAnnotations(),
            this.createColumnProgress(),
            // this.createColumnButtons()
        ];

    }

    private createColumnsForDesktop() {

        return [
            this.createColumnCheckbox(),
            this.createColumnTitle(),
            this.createColumnUpdated(),
            this.createColumnAdded(),
            this.createColumnSite(),
            this.createColumnTags(),
            this.createColumnAnnotations(),
            this.createColumnProgress(),
            this.createColumnButtons()
        ];

    }

    private createCellProps(rowInfo?: RowInfo, column?: Column) {

        if (Platforms.isMobile()) {
            return this.createCellPropsForMobile(rowInfo, column);
        } else {
            return this.createCellPropsForDesktop(rowInfo, column);
       }

    }

    private createCellPropsForMobile(rowInfo?: RowInfo, column?: Column) {

        const DEFAULT_BEHAVIOR_COLUMNS = [
            'doc-checkbox'
        ];

        if (column && column.id && DEFAULT_BEHAVIOR_COLUMNS.includes(column.id)) {

            return {

                onClick: ((e: any, handleOriginal?: () => void) => {

                    if (handleOriginal) {
                        // needed for react table to
                        // function properly.
                        handleOriginal();
                    }

                })

            };

        } else {

            return {

                onClick: (event: MouseEvent) => {

                    if (rowInfo) {
                        const repoDocInfo: RepoDocInfo = rowInfo.original;
                        this.onDocumentLoadRequested(repoDocInfo);
                    }

                },

            };

        }

    }

    private createCellPropsForDesktop(rowInfo?: RowInfo, column?: Column) {

        const DEFAULT_BEHAVIOR_COLUMNS = [
            'tag-input',
            'flagged',
            'archived',
            'doc-dropdown',
            'doc-buttons',
            'doc-checkbox'
        ];

        if (column && column.id && DEFAULT_BEHAVIOR_COLUMNS.includes(column.id)) {

            return {

                onClick: ((e: any, handleOriginal?: () => void) => {

                    if (handleOriginal) {
                        // needed for react table to
                        // function properly.
                        handleOriginal();
                    }

                })

            };

        } else {

            const handleSelect = (event: MouseEvent) => {
                if (rowInfo) {
                    this.props.selectRow(rowInfo.viewIndex as number, event);
                }
            };

            return {

                onDoubleClick: (event: MouseEvent) => {

                    if (rowInfo) {
                        const repoDocInfo: RepoDocInfo = rowInfo.original;
                        this.onDocumentLoadRequested(repoDocInfo);
                    }

                },

                onContextMenu: (event: MouseEvent) => {
                    handleSelect(event);
                },

                onClick: (event: MouseEvent, handleOriginal?: () => void) => {
                    handleSelect(event);
                },

            };

        }

    }

    public render() {

        const { data } = this.props;

        return (

            <div id="doc-table"
                 className="ml-1"
                 style={{height: '100%', overflow: 'auto'}}>

                <AccountUpgradeBar/>

                <ReactTable
                    data={[...data]}
                    ref={(reactTable: Instance) => this.props.onReactTable(reactTable)}
                    columns={this.createColumns()}
                    defaultPageSize={50}
                    noDataText="No documents available."
                    className="-striped -highlight"
                    defaultSorted={[
                        {
                            id: "progress",
                            desc: true
                        }
                    ]}
                    // sorted={[{
                    //     id: 'added',
                    //     desc: true
                    // }]}
                    getTrProps={(state: any, rowInfo: any) => {

                        return {

                            // include the doc fingerprint in the table
                            // so that the tour can use
                            'data-doc-fingerprint': ((rowInfo || {}).original || {}).fingerprint || '',

                            tabIndex: rowInfo ? (rowInfo.viewIndex as number) + 1 : undefined,

                            style: {
                                // TODO: dark-mode.  Use CSS variable
                                // names for colors

                                background: rowInfo && this.props.selected.includes(rowInfo.viewIndex) ? 'var(--selected-background-color)' : 'var(--primary-background-color)',
                                color: rowInfo && this.props.selected.includes(rowInfo.viewIndex) ? 'var(--selected-text-color)' : 'var(--primary-text-color)',
                            },

                            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                                this.onKeyDown(event);
                            },

                        };
                    }}
                    getTdProps={(state: any, rowInfo?: RowInfo, column?: Column, instance?: any) => {
                        return this.createCellProps(rowInfo, column);
                    }}

                />
            </div>

        );
    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Delete") {
            this.props.onMultiDeleted();
        }

    }

    private onDocumentLoadRequested(repoDocInfo: RepoDocInfo) {

        const fingerprint = repoDocInfo.fingerprint;

        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.props.synchronizingDocLoader.load(fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private doHandleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        this.handleToggleField(repoDocInfo, field)
            .catch(err => {
                log.error(`Could not handle toggle on field: ${field}: `, err);
            });

    }


    private async handleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        // TODO: move to syncDocInfoArchived in DocRepository

        let mutated: boolean = false;

        if (field === 'archived') {
            RendererAnalytics.event({category: 'user', action: 'archived-doc'});
            repoDocInfo.archived = !repoDocInfo.archived;
            repoDocInfo.docInfo.archived = repoDocInfo.archived;
            mutated = true;

            // used so the user can tell something actually happened because if
            // the row just vanishes it's hard to tell that something actually
            // changed.
            if (repoDocInfo.archived) {
                Toaster.success(`Document has been archived.`);
            }

        }

        if (field === 'flagged') {

            RendererAnalytics.event({category: 'user', action: 'flagged-doc'});
            repoDocInfo.flagged = !repoDocInfo.flagged;
            repoDocInfo.docInfo.flagged = repoDocInfo.flagged;

            mutated = true;
        }

        if (mutated) {

            await this.props.writeDocInfo(repoDocInfo.docInfo)
                .catch(err => log.error("Failed to write DocInfo", err));

            this.props.refresh();
        }

    }

}

interface IProps {
    readonly columns: DocRepoTableColumns;
    readonly selected: ReadonlyArray<number>;
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly relatedTags: RelatedTags;
    readonly synchronizingDocLoader: SynchronizingDocLoader;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly writeDocInfoTags: (repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) => void;
    readonly deleteDocInfo: (repoDocInfo: RepoDocInfo) => void;
    readonly writeDocInfoTitle: (repoDocInfo: RepoDocInfo, title: string) => Promise<void>;
    readonly writeDocInfo: (docInfo: IDocInfo) => Promise<void>;
    readonly onMultiDeleted: () => void;
    readonly onDocDeleted: (...repoDocInfos: RepoDocInfo[]) => void;
    readonly onDocDeleteRequested: (...repoDocInfos: RepoDocInfo[]) => void;
    readonly onDocTagged: (repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) => void;
    readonly onDocSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly selectRow: (selectedIdx: number, event: MouseEvent, checkbox?: boolean) => void;
    readonly onSelected: (selected: ReadonlyArray<number>) => void;
    readonly onReactTable: (reactTable: Instance) => void;
    readonly refresh: () => void;
}

interface IState {
}


