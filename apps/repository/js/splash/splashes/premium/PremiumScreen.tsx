import * as React from 'react';
import {FixedNav} from '../../../FixedNav';
import {FixedNavBody} from '../../../FixedNav';
import {RepoHeader} from '../../../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../../../web/js/datastore/PersistenceLayerManager';
import {PremiumContent} from './PremiumContent';
import {PremiumContent2} from './PremiumContent2';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountPlan} from '../../../../../../web/js/accounts/Account';

export class PremiumScreen extends React.Component<IProps, IState> {

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

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent2 userInfo={this.props.userInfo} plan={this.props.plan}/>
                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly plan: AccountPlan;
    readonly userInfo?: UserInfo;
}

export interface IState {

}
