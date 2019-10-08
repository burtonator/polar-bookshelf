import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Groups} from "../../../../web/js/datastore/sharing/db/Groups";
import {Logger} from "polar-shared/src/logger/Logger";
import {GroupTable} from "./GroupTable";
import {GroupDocInfos} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";
import {VerticalAlign} from "../../../../web/js/ui/util/VerticalAlign";
import {GroupData} from "./GroupData";
import {UserGroups} from "../../../../web/js/datastore/sharing/db/UserGroups";
import {GroupDeleteButton} from './GroupDeleteButton';
import {GroupNavbar} from "./GroupNavbar";
import {GroupURLs} from "polar-webapp-links/src/groups/GroupURLs";

const log = Logger.create();

export class GroupScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        const groupURL = GroupURLs.parse(document.location.href);

        this.state = {
            name: groupURL.name
        };

    }

    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            const groupName = this.state.name;

            if (! groupName) {
                Toaster.error("No group name");
                return;
            }

            const group = await Groups.getByName(groupName);

            if (! group) {
                Toaster.error("No group named: " + groupName);
                return;
            }

            // TODO I dont' like how these are all dependent on each other
            // as there is excess latency here.

            const groupDocInfos = await GroupDocInfos.list(group.id);

            const userGroup = await UserGroups.get();

            this.setState({
                ...this.state,
                groupData: {
                    id: group.id,
                    group,
                    groupDocInfos,
                    userGroup
                }});

        };

        doHandle().catch(err => log.error("Unable to get groups: ", err));

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                </header>

                <FixedNavBody>

                    <div className="container">
                        <div className="row">

                            <div className="col">

                                <div className="mt-2 p-2 border-top border-left border-right bg-grey000">

                                    <div>
                                        <GroupNavbar groupName={this.state.name}>

                                            <VerticalAlign>
                                                <GroupDeleteButton groupData={this.state.groupData}/>
                                            </VerticalAlign>

                                        </GroupNavbar>
                                    </div>

                                </div>

                                <GroupTable persistenceLayerManager={this.props.persistenceLayerManager}
                                            groupData={this.state.groupData}/>

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
    readonly name: string;
    readonly groupData?: GroupData;
}
