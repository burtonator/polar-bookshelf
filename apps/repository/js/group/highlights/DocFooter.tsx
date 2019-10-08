import * as React from 'react';
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {DocAnnotationComponent} from "./annotations/DocAnnotationComponent";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {Profile} from "../../../../../web/js/datastore/sharing/db/Profiles";
import {DocAnnotationMoment} from "../../../../../web/js/annotation_sidebar/DocAnnotationMoment";
import {BaseDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {RelativeMoment} from "../../../../../web/js/ui/util/RelativeMoment";
import {GroupDocAddButton} from "../GroupDocAddButton";
import {GroupIDStr} from "../../../../../web/js/datastore/Datastore";

export class DocFooter extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {props} = this;
        const {docAnnotationProfileRecord} = props;
        const {profile} = this.props.docAnnotationProfileRecord;
        const docAnnotation = docAnnotationProfileRecord.value;

        if (profile) {

            return (

                <div style={{display: 'flex'}} className="pt-1">

                    <div className="text-bold mt-auto mb-auto"
                         style={{flexGrow: 1}}>

                        {docAnnotation.docRef.title || ""}

                    </div>

                    <div className="text-bold mt-auto mb-auto">

                        <GroupDocAddButton persistenceLayerProvider={this.props.persistenceLayerProvider}
                                           groupID={this.props.groupID}
                                           fingerprint={docAnnotation.docRef.fingerprint}/>
                    </div>

                </div>

            );

        } else {

            return (
                <div/>
            );

        }

    }

}

export interface IProps {

    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly groupID: GroupIDStr;
    readonly docAnnotationProfileRecord: ProfileRecord<BaseDocAnnotation>;

}

export interface IState {
}
