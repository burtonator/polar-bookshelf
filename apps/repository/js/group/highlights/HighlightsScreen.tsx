import * as React from 'react';
import {GroupNameStr, Groups} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotations} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {GroupHighlightsData} from "./GroupHighlightsData";
import {Logger} from "polar-shared/src/logger/Logger";
import {Toaster} from "../../../../../web/js/ui/toaster/Toaster";
import {FixedNav, FixedNavBody} from "../../FixedNav";
import {RepoHeader} from "../../repo_header/RepoHeader";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {HighlightsTable} from "./HighlightsTable";
import {ProfileJoins} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {GroupNavbar} from "../GroupNavbar";
import {GroupURLs} from "polar-webapp-links/src/groups/GroupURLs";

const log = Logger.create();

export class HighlightsScreen extends React.Component<IProps, IState> {

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

            console.time('Groups.getByName');
            const group = await Groups.getByName(groupName);
            console.timeEnd('Groups.getByName');

            if (! group) {
                Toaster.error("No group named: " + groupName);
                return;
            }

            console.time('group-doc-annotations-list');
            const docAnnotations = await GroupDocAnnotations.list(group.id);
            console.timeEnd('group-doc-annotations-list');

            console.time('docAnnotationProfileRecords');
            const docAnnotationProfileRecords = await ProfileJoins.join(docAnnotations);
            console.timeEnd('docAnnotationProfileRecords');

            this.setState({
                ...this.state,
                groupHighlightsData: {
                    id: group.id,
                    group,
                    docAnnotationProfileRecords,
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

                    <div className="container mb-1">
                        <div className="row">

                            <div className="col">

                                <div className="mt-2 p-2 border-top border-left border-right bg-grey000">

                                    <div>
                                        <GroupNavbar groupName={this.state.name}/>
                                    </div>

                                </div>

                                <HighlightsTable persistenceLayerManager={this.props.persistenceLayerManager}
                                                 groupHighlightsData={this.state.groupHighlightsData}/>

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
    readonly name: GroupNameStr;
    readonly groupHighlightsData?: GroupHighlightsData;
}
