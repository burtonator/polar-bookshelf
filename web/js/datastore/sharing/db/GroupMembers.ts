import {GroupIDStr} from '../../Datastore';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ProfileIDStr} from './Profiles';
import {Firebase} from '../../../firebase/Firebase';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Collections, DocumentChange} from './Collections';

export class GroupMembers {

    public static readonly COLLECTION = 'group_member';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMember>> {
        const user = await Firebase.currentUser();
        Preconditions.assertPresent(user, 'user');
        return await Collections.list(this.COLLECTION, [['groupID' , '==', groupID]]);
    }

    /**
     *
     * Get the members of this group.
     */
    public static async onSnapshot(groupID: GroupIDStr,
                                   delegate: (records: ReadonlyArray<DocumentChange<GroupMember>>) => void) {

        return await Collections.onQuerySnapshotChanges(this.COLLECTION, [['groupID' , '==', groupID]], delegate);

    }

}

export interface GroupMemberInit {

    readonly profileID: ProfileIDStr;

    readonly groupID: GroupIDStr;

}

export interface GroupMember extends GroupMemberInit {

    /**
     * The ID for this entry.
     */
    readonly id: string;

    readonly created: ISODateTimeString;

}
