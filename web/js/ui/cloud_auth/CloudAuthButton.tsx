/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {CloudLoginModal} from './CloudLoginModal';
import {Firebase} from '../../firebase/Firebase';
import * as firebase from '../../firebase/lib/firebase';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {CloudSyncConfiguredModal} from './CloudSyncConfiguredModal';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Nav} from '../util/Nav';
import {InviteUsersModal} from './InviteUsersModal';
import {Invitations} from '../../datastore/Invitations';
import {URLs} from 'polar-shared/src/util/URLs';
import {EnableCloudSyncButton} from './EnableCloudSyncButton';
import {AccountDropdown} from './AccountDropdown';
import {AuthHandlers, UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControlDropdown} from './AccountControlDropdown';

const log = Logger.create();

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.enableCloudSync = this.enableCloudSync.bind(this);

        let stage: AuthStage | undefined;

        if (document.location!.hash === '#login') {
            RendererAnalytics.event({category: 'cloud', action: 'login'});
            stage = 'login';
        }

        if (document.location!.hash === "#configured") {
            RendererAnalytics.event({category: 'cloud', action: 'configured'});
            stage = 'configured';
        }

        this.state = {
            mode: 'none',
            stage
        };

        log.info("auth state: ", this.state);

        Firebase.init();

        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public render() {

        const AccountButton = () => {

            if (this.state.userInfo) {

                return <AccountControlDropdown userInfo={this.state.userInfo}
                                               onInvite={() => this.changeAuthStage('invite')}
                                               onLogout={() => this.logout()}/>;

            } else {

                return <AccountDropdown onInvite={() => this.changeAuthStage('invite')}
                                        onLogout={() => this.logout()}/>;

            }

        };

        if (this.state.mode === 'needs-auth') {
            return (
                <div>

                    <EnableCloudSyncButton onClick={() => this.enableCloudSync()}/>

                    <CloudLoginModal isOpen={this.state.stage === 'login'}
                                     onCancel={() => this.changeAuthStage()}/>


                    {/*<CloudSyncOverviewModal isOpen={this.state.stage === 'overview'}*/}
                                            {/*onCancel={() => this.changeAuthStage()}*/}
                                            {/*onSignup={() => this.changeAuthStage('login')}/>*/}

                </div>

            );

        } else if (this.state.mode === 'authenticated') {

            return (
                <div>

                    <CloudSyncConfiguredModal isOpen={this.state.stage === 'configured'}
                                              onCancel={() => this.changeAuthStage()}/>

                    <InviteUsersModal isOpen={this.state.stage === 'invite'}
                                      onCancel={() => this.changeAuthStage()}
                                      onInvite={(emailAddresses) => this.onInvitedUsers(emailAddresses)}/>

                    <AccountButton/>

                </div>

            );

        } else {
            return (<div></div>);
        }

    }

    private logout() {

        this.props.persistenceLayerManager.reset();

        firebase.auth().signOut()
            .then(() => {

                window.location.href = Nav.createHashURL('logout');
                window.location.reload();

            })
            .catch(err => log.error("Unable to logout: ", err));

    }

    private onInvitedUsers(emailAddresses: ReadonlyArray<string>) {

        const handleInvitedUsers = async () => {

            await Invitations.sendInvites(...emailAddresses);
            this.changeAuthStage();

        };

        handleInvitedUsers()
            .catch(err => log.error("Unable to invite users: ", err));

    }

    private enableCloudSync() {
        this.changeAuthStage('login');
    }

    private changeAuthStage(stage?: AuthStage) {

        if (stage === 'login') {
            const base = URLs.toBase(document.location!.href);
            const newLocation = new URL('/apps/repository/login.html', base).toString();
            window.location.href = newLocation;
            return;
        }

        if (stage) {

            RendererAnalytics.event({category: 'cloud', action: 'stage-' + stage});

            document.location!.hash = stage;

        } else {
            document.location!.hash = '';
        }

        this.setState({
            mode: this.state.mode,
            stage
        });

    }

    private onAuth(user: firebase.User | null) {

        AuthHandlers.get().userInfo()
            .then((userInfo) => {

                let mode: AuthMode = 'needs-auth';

                if (user) {
                    mode = 'authenticated';
                }

                this.setState({
                    mode,
                    userInfo: userInfo.getOrUndefined()
                });


            })
            .catch(err => log.error("Unable to get user info: ", err));

    }

    private onAuthError(err: firebase.auth.Error) {
        log.error("Authentication error: ", err);
    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {
    readonly mode: AuthMode;
    readonly stage?: AuthStage;
    readonly userInfo?: UserInfo;
}

type AuthMode = 'none' | 'needs-auth' | 'authenticated';

type AuthStage = 'overview' | 'login' | 'configured' | 'invite';
