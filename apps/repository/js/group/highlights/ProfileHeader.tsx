import * as React from 'react';
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {BaseDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {RelativeMoment} from "../../../../../web/js/ui/util/RelativeMoment";
import {Link} from 'react-router-dom';
import {GroupNameStr} from "../../../../../web/js/datastore/sharing/db/Groups";

export class ProfileHeader extends React.Component<IProps, IState> {

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

                <div style={{display: 'flex'}}>

                    <div>{profile.name || profile.handle}</div>

                    <div className="text-grey200 ml-1">
                        <Link to={{pathname: `/group/${this.props.groupName}/highlight/${docAnnotation.id}`}}>
                            <RelativeMoment datetime={docAnnotation.lastUpdated || docAnnotation.created}/>
                        </Link>
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
    readonly groupName: GroupNameStr;
    readonly docAnnotationProfileRecord: ProfileRecord<BaseDocAnnotation>;
}

export interface IState {
}
