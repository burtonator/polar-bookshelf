import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group, Groups} from "../../../../web/js/datastore/sharing/db/Groups";
import {Logger} from "polar-shared/src/logger/Logger";
import {GroupsTable} from "./GroupsTable";
import {CreateGroupButton} from "./CreateGroupButton";
import {VerticalAlign} from "../../../../web/js/ui/util/VerticalAlign";

const log = Logger.create();

export class GroupsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }


    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            const groups = await Groups.topGroups();

            this.setState({groups});

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

                                <div className="mt-4 mb-4 text-grey700">
                                    <div className="text-xl">
                                        Groups allow you to share documents and highlights.
                                    </div>

                                    <div className="mt-2">
                                        This is still a <b>beta</b> feature but we're actively working on making
                                        it production-ready.  You can add documents to groups, and see annotations
                                        and comments by other users.  We're going to be adding improved commenting
                                        and working on making it easy to share documents.
                                    </div>

                                    <div className="mt-1">
                                    If you're interested in using group in your organization we'd love
                                    to <a href="https://kevinburton1.typeform.com/to/Ze4mqY">get your feedback</a>.
                                    </div>

                                </div>

                                <div className="mt-2 p-2 border-top border-left border-right bg-grey000">

                                    <div style={{display: 'flex'}}
                                         className="w-100">

                                        <div style={{flexGrow: 1}}>
                                            <h3>Groups</h3>
                                        </div>

                                        <VerticalAlign>
                                            <CreateGroupButton/>
                                        </VerticalAlign>

                                    </div>

                                </div>

                                <GroupsTable persistenceLayerManager={this.props.persistenceLayerManager}
                                             groups={this.state.groups}/>

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
    readonly groups?: ReadonlyArray<Group>;
}
