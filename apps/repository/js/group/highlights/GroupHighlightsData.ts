import {GroupIDStr} from "../../../../../web/js/datastore/Datastore";
import {Group} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";

export interface GroupHighlightsData {
    readonly id: GroupIDStr;
    readonly group: Group;
    readonly docAnnotationProfileRecords: ReadonlyArray<ProfileRecord<GroupDocAnnotation>>;
}
