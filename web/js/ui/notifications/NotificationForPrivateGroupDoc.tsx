import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {GroupDocRef} from '../../datastore/sharing/GroupDatastores';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Toaster} from '../toaster/Toaster';
import {Logger} from 'polar-shared/src/logger/Logger';
import {GroupJoins} from '../../datastore/sharing/rpc/GroupJoins';
import {UserImage} from './UserImage';

const log = Logger.create();

export class NotificationForPrivateGroupDoc extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onAdd = this.onAdd.bind(this);

    }

    public render() {

        const {invitation} = this.props;
        const doc = invitation.docs[0];
        const from = invitation.from;

        return (

            <div className="">

                <div className="text-lg">
                    {doc.title}
                </div>

                <div>
                    {doc.description || ""}
                </div>

                <p className="border-left border-secondary ml-1 pl-1 mt-1">
                    {invitation.message}
                </p>

                <div style={{display: 'flex'}}>

                    <div className="mt-auto mb-auto"
                         style={{
                             flexGrow: 1,
                             display: 'flex'
                         }}>

                        <UserImage name={from.name} image={from.image}/>

                        <div className="mt-auto mb-auto ml-1">
                            {from.name}
                        </div>

                    </div>

                    <div className="mt-auto mb-auto">
                        <Button color="success"
                                size="sm"
                                onClick={() => this.onAdd()}
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 'bold'
                                }}
                                className="">

                            <i className="fas fa-plus" style={{ marginRight: '5px' }}/> Add &nbsp;

                        </Button>

                    </div>

                </div>

            </div>

        );

    }

    private onAdd() {

        const persistenceLayer = this.props.persistenceLayerProvider();

        Toaster.info("Adding documents to document repository");

        const {invitation} = this.props;

        GroupJoins.execAndAdd(persistenceLayer, invitation)
            .then(() => Toaster.success("Added documents successfully to document repository."))
            .catch(err => {
                const msg = "Failed to add document to repository: ";
                log.error(msg, err);
                Toaster.error(msg + err.message);
            });

    }

}

interface IProps {
    readonly invitation: GroupMemberInvitation;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
}
