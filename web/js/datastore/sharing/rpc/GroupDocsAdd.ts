import {JSONRPC} from './JSONRPC';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {GroupIDStr} from '../../Datastore';

export class GroupDocsAdd {

    public static async exec(request: GroupDocAddRequest): Promise<void> {
        return await JSONRPC.exec('groupDocsAdd', request);
    }

}

export interface GroupDocAddRequest {
    readonly groupID: GroupIDStr;
    readonly docs: ReadonlyArray<DocRef>;
}
