import {JSONRPC} from './JSONRPC';
import {GroupIDStr} from '../../Datastore';

export class GroupDeletes {

    public static async exec(request: GroupDeleteRequest): Promise<GroupDeleteResponse> {
        return await JSONRPC.exec('groupDelete', request);
    }

}

export interface GroupDeleteRequest {
    readonly groupID: GroupIDStr;
}

export interface GroupDeleteResponse {

}

