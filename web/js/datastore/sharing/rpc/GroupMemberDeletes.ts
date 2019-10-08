import {JSONRPC} from './JSONRPC';
import {GroupIDStr} from '../../Datastore';
import {UserRef} from './UserRefs';

export class GroupMemberDeletes {

    public static async exec(request: GroupMemberDeleteRequest): Promise<void> {
        return await JSONRPC.exec('groupMemberDelete', request);
    }

}

export interface GroupMemberDeleteRequest {

    readonly groupID: GroupIDStr;
    readonly userRefs: ReadonlyArray<UserRef>;

}
