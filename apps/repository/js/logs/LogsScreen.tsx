import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import LogsContent from './LogsContent';
import CopyLogsToClipboardButton from './CopyLogsToClipboardButton';
import ClearLogsButton from './ClearLogsButton';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';

const log = Logger.create();

export default class LogsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <div style={{display: 'flex'}}>

                        <div className="mb-1">
                            <CopyLogsToClipboardButton/>
                        </div>

                        <div className="ml-1 mb-1">
                            <ClearLogsButton/>
                        </div>

                    </div>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12">

                            <div className="mb-2 pl-1 pr-1">
                                <LogsContent/>
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
}

export interface IState {

}
