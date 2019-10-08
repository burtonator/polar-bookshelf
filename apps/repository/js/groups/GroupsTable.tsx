import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {GroupCard} from "./GroupCard";
import {LoadingProgress} from "../../../../web/js/ui/LoadingProgress";

export class GroupsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groups} = this.props;

        if (! groups) {
            return <LoadingProgress/>;
        }

        return (

            <div className="border-bottom">
                {groups.map(group =>
                    <GroupCard key={group.id} group={group}/>)}
            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly groups?: ReadonlyArray<Group>;
}

export interface IState {
}
