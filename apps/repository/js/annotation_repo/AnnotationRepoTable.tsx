import * as React from 'react';
import ReactTable from "react-table";
import {Logger} from 'polar-shared/src/logger/Logger';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {ExtendedReactTable, IReactTableState} from '../util/ExtendedReactTable';
import {AnnotationPreview} from './AnnotationPreview';

const log = Logger.create();

export default class AnnotationRepoTable extends ExtendedReactTable<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;

        this.state = {
        };

    }

    public onSelected(selected: number,
                      repoAnnotation: RepoAnnotation) {

        this.setState({...this.state, selected, repoAnnotation});
        this.props.onSelected(repoAnnotation);

    }

    public render() {
        const { data } = this.props;

        return (

            <div id="doc-repo-table">

                <div id="doc-table">

                    <ReactTable
                        data={[...data]}
                        // headerProps={{display: 'none'}}
                        columns={
                            [
                                // {
                                //     Header: '',
                                //     accessor: 'type',
                                //     maxWidth: 30,
                                //
                                //     Cell: (row: any) => {
                                //         return (
                                //
                                //             <div className="text-center">
                                //                 <AnnotationIcon type={row.original.type} color={row.original.color}/>
                                //             </div>
                                //
                                //         );
                                //     }
                                //
                                // },
                                {
                                    Header: '',
                                    accessor: 'title',
                                    headerStyle: {display: 'none'},
                                    style: {whiteSpace: 'normal'},
                                    Cell: (row: any) => {
                                        const id = 'annotation-title' + row.index;

                                        const annotation: RepoAnnotation = row.original;

                                        return (

                                            <AnnotationPreview id={id}
                                                               text={annotation.text}
                                                               img={annotation.img}
                                                               created={annotation.created}/>

                                        );

                                    }

                                },
                                {
                                    Header: 'Created',
                                    // accessor: (row: any) => row.added,
                                    accessor: 'created',
                                    show: false,

                                },
                                // {
                                //     id: 'tags',
                                //     Header: 'Tags',
                                //     accessor: '',
                                //     show: true,
                                //     width: 200,
                                //     Cell: (row: any) => {
                                //
                                //         // TODO: use <FormattedTags>
                                //
                                //         const tags: {[id: string]: Tag} = row.original.tags;
                                //
                                //         const formatted = Object.values(tags)
                                //             .map(tag => tag.label)
                                //             .sort()
                                //             .join(", ");
                                //
                                //         return (
                                //             <div>{formatted}</div>
                                //         );
                                //
                                //     }
                                // },

                            ]}

                        defaultPageSize={50}
                        noDataText="No annotations available."
                        className="-striped -highlight"
                        defaultSorted={[
                            {
                                id: "created",
                                desc: true
                            }
                        ]}
                        // sorted={[{
                        //     id: 'added',
                        //     desc: true
                        // }]}
                        getTrProps={(state: any, rowInfo: any) => {

                            const doSelect = () => {

                                if (rowInfo && rowInfo.original) {
                                    const repoAnnotation = rowInfo.original as RepoAnnotation;
                                    this.onSelected(rowInfo.viewIndex as number, repoAnnotation);
                                } else {
                                    // this is not a row with data and just an
                                    // empty row and we have to handle this or
                                    // we will get an exception.
                                }

                            };

                            return {

                                onClick: (e: any) => {
                                    doSelect();
                                },

                                onFocus: () => {
                                    doSelect();
                                },

                                tabIndex: rowInfo ? (rowInfo.viewIndex as number) + 1 : undefined,

                                onKeyDown: (e: any) => {
                                    // this works but I need to handle the arrow keys properly...
                                    // console.log("on key press: ");
                                },

                                style: {
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: rowInfo && rowInfo.viewIndex === this.state.selected ? '#00afec' : 'white',
                                    // color: rowInfo && rowInfo.viewIndex === this.state.selected ? 'white' : 'black',
                                }

                            };
                        }}
                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

                            const singleClickColumns: string[] = [];

                            if (! singleClickColumns.includes(column.id)) {
                                return {

                                    onDoubleClick: (e: any) => {
                                        // this.onDocumentLoadRequested(rowInfo.original.fingerprint,
                                        // rowInfo.original.filename,
                                        // rowInfo.original.hashcode);
                                    }
                                };
                            }

                            if (singleClickColumns.includes(column.id)) {

                                return {

                                    onClick: ((e: any, handleOriginal?: () => void) => {
                                        //
                                        // this.handleToggleField(rowInfo.original,
                                        // column.id) .catch(err =>
                                        // log.error("Could not handle toggle:
                                        // ", err));

                                        if (handleOriginal) {
                                            // needed for react table to
                                            // function properly.
                                            handleOriginal();
                                        }

                                    })

                                };

                            }

                            return {};

                        }}

                    />

                </div>

            </div>

        );
    }

}

interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly onSelected: (repoAnnotation: RepoAnnotation) => void;

    readonly data: ReadonlyArray<RepoAnnotation>;

    // readonly setFiltered: ChannelCoupler<AnnotationRepoFilters>;

}

interface IState extends IReactTableState {


    /**
     * The currently selected repo annotation.
     */
    repoAnnotation?: RepoAnnotation;

}
