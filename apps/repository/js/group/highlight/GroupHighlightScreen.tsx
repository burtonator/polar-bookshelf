import * as React from 'react';
import {Groups} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotations} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {Logger} from "polar-shared/src/logger/Logger";
import {Toaster} from "../../../../../web/js/ui/toaster/Toaster";
import {FixedNav, FixedNavBody} from "../../FixedNav";
import {RepoHeader} from "../../repo_header/RepoHeader";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {ProfileJoins} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {GroupHighlightData} from "./GroupHighlightData";
import {HighlightCard} from "../highlights/HighlightCard";
import {GroupHighlightURL, GroupHighlightURLs} from "polar-webapp-links/src/groups/GroupHighlightURLs";

const log = Logger.create();

export class GroupHighlightScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        const parsedURL = GroupHighlightURLs.parse(document.location.href);

        this.state = {
            ...parsedURL
        };

    }

    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            const groupName = this.state.name;

            const group = await Groups.getByName(groupName);

            if (! group) {
                Toaster.error("No group named: " + groupName);
                return;
            }

            const docAnnotation = await GroupDocAnnotations.get(group.id, this.state.id);

            const docAnnotationProfileRecord = await ProfileJoins.record(docAnnotation);

            this.setState({
                ...this.state,
                groupHighlightData: {
                    id: group.id,
                    group,
                    docAnnotationProfileRecord,
                }});

        };

        doHandle().catch(err => log.error("Unable to get groups: ", err));

    }

    public render() {

        const {groupHighlightData} = this.state;

        if (! groupHighlightData) {
            return <div/>;
        }

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                </header>

                <FixedNavBody>

                    <div className="container">

                        <div className="row">

                            <div className="col">

                                <div className="border-bottom mt-2">

                                    <HighlightCard persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}
                                                   groupID={groupHighlightData.group.id}
                                                   groupName={groupHighlightData.group.name!}
                                                   docAnnotationProfileRecord={groupHighlightData.docAnnotationProfileRecord}/>
                                </div>

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

export interface IState extends GroupHighlightURL {
    readonly groupHighlightData?: GroupHighlightData;
}
