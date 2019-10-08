import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocInfoCard} from "./GroupDocInfoCard";
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {GroupData} from "./GroupData";
import Button from "reactstrap/lib/Button";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {UserGroups} from "../../../../web/js/datastore/sharing/db/UserGroups";
import {GroupDeletes} from "../../../../web/js/datastore/sharing/rpc/GroupDeletes";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";

export class GroupDeleteButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.onDeleteConfirmed = this.onDeleteConfirmed.bind(this);

    }

    public render() {

        const {groupData} = this.props;

        if (! groupData) {
            return <div/>;
        }

        const {userGroup, id, group} = groupData;

        const isAdmin = UserGroups.hasAdminForGroup(id, userGroup);

        return (

            <div className="mr-1 ml-1">

                <Button color="danger"
                        size="sm"
                        hidden={! isAdmin}
                        onClick={() => this.onDelete(group)}
                        className="pl-2 pr-2">

                    <i className="fas fa-trash-alt" style={{marginRight: '5px'}}/> Delete

                </Button>

            </div>

        );

    }

    private onDelete(group: Group) {

        Dialogs.confirm({
            title: "Are you sure you want to delete this group?",
            subtitle: "Deleting is final and everyone will lose access to the annotations.  " +
                      "They will still have access to their own annotations and the original documents.",
            onConfirm: () => this.onDeleteConfirmed(group)
        });

    }

    private onDeleteConfirmed(group: Group) {

        Toaster.info(`Going to delete group ${group.name}...`);

        const doHandle = async () => {

            await GroupDeletes.exec({groupID: group.id});

            Toaster.success(`Deleted group ${group.name} successfully!`);

        };

        doHandle()
            .catch(err => {
                const msg = "Failed to delete group";
                Toaster.error(msg);
                console.error(msg, err);
            });

    }

}

export interface IProps {
    readonly groupData?: GroupData;
}

export interface IState {
}
