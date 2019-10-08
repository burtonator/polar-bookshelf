import * as React from 'react';
import {EditorsPicksContent} from './EditorsPicksContent';
import {RepoHeader} from '../repo_header/RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';

export default class EditorsPicksScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <header>
                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>
                </header>


                <div className="m-1">

                    <h3>Suggested Content</h3>

                    <p className="text-muted" style={{fontSize: '18px'}}>
                        In order to get you up and running quickly, we've compiled
                        a list of interesting documents you might like to start with.
                    </p>

                    <p>
                        When you add any of these documents they will be automatically
                        downloaded and added to your repository.
                    </p>

                    <EditorsPicksContent/>

                </div>

            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;

}

export interface IState {

}

