import {GroupIDStr} from "../../../../web/js/datastore/Datastore";
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {UserGroup} from "../../../../web/js/datastore/sharing/db/UserGroups";
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";

export interface GroupData {
    readonly id: GroupIDStr;
    readonly group: Group;
    readonly groupDocInfos: ReadonlyArray<GroupDocInfo>;

    /**
     * The groups for the user. Only known if the user is actually authenticated
     */
    readonly userGroup?: UserGroup;

}
