import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {EmailStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {Firebase} from '../../../firebase/Firebase';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {Image} from './Images';
import {Collections, DocumentChange} from './Collections';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Clause} from './Collections';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class GroupMemberInvitations {

    public static readonly COLLECTION = 'group_member_invitation';

    public static async list(): Promise<ReadonlyArray<GroupMemberInvitation>> {

        const user = await Firebase.currentUser();
        Preconditions.assertPresent(user, 'user');
        return await Collections.list(this.COLLECTION, [['to' , '==', user!.email]]);

    }

    public static async listByGroupID(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMemberInvitation>> {

        const clauses: Clause[] = [
            ['groupID' , '==', groupID],
        ];

        return await Collections.list(this.COLLECTION, clauses);

    }

    public static async listByGroupIDAndProfileID(groupID: GroupIDStr,
                                                  profileID: ProfileIDStr): Promise<ReadonlyArray<GroupMemberInvitation>> {

        const clauses: Clause[] = [
            ['groupID' , '==', groupID],
            ['from.profileID' , '==', profileID]
        ];

        return await Collections.list(this.COLLECTION, clauses);

    }

    public static async onSnapshot(delegate: (invitations: ReadonlyArray<GroupMemberInvitation>) => void) {

        const user = await Firebase.currentUser();

        if (! user) {
            // no current user so there's nothing we can do yet.
            log.warn("No user. No notifications will be delivered");
            return;
        }

        return await Collections.onQuerySnapshot(this.COLLECTION, [['to', '==', user!.email]], delegate);

    }

    public static async purge() {
        await Collections.deleteByID(this.COLLECTION, () => this.list());
    }

}


export interface GroupMemberInvitationInit {

    readonly groupID: GroupIDStr;

    readonly to: EmailStr;

    readonly message: string;

    /**
     * We have to keep the sender so that when we go to accept the doc we
     * actually know who it's from.
     */
    readonly from: Sender;

    /**
     * The actual DocID we're working with.
     */
    readonly docs: ReadonlyArray<DocRef>;

}

export interface GroupMemberInvitation extends GroupMemberInvitationInit {

    /**
     * The ID for this entry.
     */
    readonly id: string;

    readonly created: ISODateTimeString;
}

export interface Sender {

    readonly profileID: ProfileIDStr;

    readonly name: string;

    readonly email?: string;

    readonly image: Image | null;

}

