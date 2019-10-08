import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import NewDocumentRateChart from './NewDocumentRateChart';
import TopTagsChart from './TopTagsChart';
import TopTagsTable from './TopTagsTable';
import {MessageBanner} from '../MessageBanner';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import ReadingProgressTable from './ReadingProgressTable';

const log = Logger.create();

export default class StatsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const docInfos =
            this.props.repoDocMetaManager.repoDocInfoIndex.values()
                .map(current => current.docInfo);

        return (

            <FixedNav id="doc-repository" className="statistics-view">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <MessageBanner/>

                </header>

                <FixedNavBody>

                    <div className="container-fluid">

                        <div className="row mt-2">

                            <div className="col-lg-12">
                                <ReadingProgressTable docInfos={docInfos}/>
                            </div>

                        </div>

                        <div className="row mt-2">

                            <div className="col-lg-12">
                                <NewDocumentRateChart docInfos={docInfos}/>
                            </div>

                        </div>

                        <div className="row mt-2 tag-statistics">

                            <div className="col-lg-8">
                                <TopTagsChart docInfos={docInfos}/>
                            </div>

                            <div className="col-lg-4">
                                <TopTagsTable docInfos={docInfos}/>
                            </div>

                        </div>

                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {

}
