import {GroupIDStr} from "../../../../../web/js/datastore/Datastore";
import {Group} from "../../../../../web/js/datastore/sharing/db/Groups";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";

export interface GroupHighlightData {
    readonly id: GroupIDStr;
    readonly group: Group;
    readonly docAnnotationProfileRecord?: ProfileRecord<GroupDocAnnotation>;
}
