import {GroupInit} from '../db/Groups';
import {JSONRPC} from './JSONRPC';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {UserRef} from './UserRefs';
import {PlainTextStr, URLStr} from "polar-shared/src/util/Strings";

export class GroupProvisions {

    public static async exec(request: GroupProvisionRequest): Promise<GroupProvisionResponse> {
        return await JSONRPC.exec('groupProvision', request);
    }

}

export interface GroupProvisionRequest extends GroupInit {

    /**
     * Use a user specific 'key' to compute a groupID rather than using a global
     * name.  They key could be anything as long as it's unique within the users
     * 'namespace'.  This can be used for computing a unique group for a users
     * document that they are sharing.
     */
    readonly key?: string;

    /**
     * Used when we're provisioning a group with an initial set of documents.
     */
    readonly docs: ReadonlyArray<DocRef>;

    /**
     * Invite the users in this set of invitations to a group of users.
     */
    readonly invitations: UserRefInvitations;

}

export interface GroupProvisionResponse {

    /**
     * The ID of the group that was provisioned.
     */
    readonly id: string;

    /**
     * When using a custom group with a custom name.
     */
    readonly name?: string;

}

export interface ExternalLink {
    readonly name: PlainTextStr;
    readonly url: URLStr;
}

interface UserRefInvitations {

    readonly message: string;

    readonly to: ReadonlyArray<UserRef>;

}

export type DocIDStr = string;
