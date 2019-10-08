import React from 'react';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupMemberInvitations} from '../../datastore/sharing/db/GroupMemberInvitations';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../toaster/Toaster';
import {NotificationButton} from './NotificationButton';

const log = Logger.create();

export class Notifications extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            invitations: []
        };

        GroupMemberInvitations.onSnapshot(invitations => {

            console.log("Got invitations: ", invitations);

            this.setState({invitations});

        }).catch(err => {
            const msg = "Unable to get group notifications: ";
            log.error(msg, err);
            Toaster.error(msg, err.message);
        });

    }

    public render() {

        return (

            <NotificationButton persistenceLayerProvider={this.props.persistenceLayerProvider}
                                invitations={this.state.invitations}/>

        );

    }


}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly invitations: ReadonlyArray<GroupMemberInvitation>;
}
