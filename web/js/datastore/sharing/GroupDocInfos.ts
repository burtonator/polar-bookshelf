import {GroupIDStr} from "../Datastore";
import {Collections, OrderByClause} from "./db/Collections";
import {GroupDoc} from "./db/GroupDocs";
import {Tag} from "../../tags/Tags";
import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import { DocRef } from "polar-shared/src/groups/DocRef";

export class GroupDocInfos {

    public static readonly COLLECTION = 'group_doc_info';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDocInfo>> {

        // TODO we should really migrate this to use a a snapshot listener...

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['added', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION, [['groupID', '==', groupID]], {limit, orderBy});

    }

}
// TODO: move to polar-shared
export interface GroupDocInfoInit {

    /**
     * The group that this doc is associated with.
     */
    readonly groupID: GroupIDStr;

    readonly fingerprint: string;

    readonly title: string;

    readonly subtitle?: string;

    readonly nrPages: number;

    readonly description?: string;

    readonly url?: string;

    // The user tags from this user for their version of this doc.  This
    // excludes special typed tags and folder tags
    readonly tags?: {[id: string]: Tag};

    readonly published?: ISODateTimeString;

    readonly doi?: string;

}

export interface GroupDocInfo extends GroupDocInfoInit {

    /**
     * The time this doc was first added in the group.
     */
    readonly added: ISODateString;

}
