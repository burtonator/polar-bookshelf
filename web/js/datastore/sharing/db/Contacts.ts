import {EmailStr} from './Profiles';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Firebase} from '../../../firebase/Firebase';
import {Collections, DocumentChange} from './Collections';
import {Preconditions} from 'polar-shared/src/Preconditions';

export class Contacts {

    public static readonly COLLECTION = 'contact';

    public static async list(): Promise<ReadonlyArray<Contact>> {

        const user = await Firebase.currentUser();
        const {uid} = Preconditions.assertPresent(user, 'user');

        return await Collections.list(this.COLLECTION, [['uid' , '==', uid]]);

    }

    public static async onSnapshot(delegate: (records: ReadonlyArray<DocumentChange<Contact>>) => void) {

        const user = await Firebase.currentUser();
        const {uid} = Preconditions.assertPresent(user, 'user');

        return await Collections.onQuerySnapshotChanges(this.COLLECTION, [['uid' , '==', uid]], delegate);

    }

    /**
     * Delete all of the user contacts...
     */
    public static async purge() {
        await Collections.deleteByID(this.COLLECTION, () => this.list());
    }

}

export interface ContactInit {

    readonly profileID?: EmailStr;
    readonly email?: EmailStr;

    /**
     * The label for this contact.  This is either the parsed 'name' that we
     * parsed from the email or it's going to be the profile name from their
     * profile metadata.
     */
    readonly label?: string;

    /**
     * The relationship with this contact.
     */
    readonly rel: ContactRelArray;

    /**
     * True if the user has me as a friend too.
     */
    readonly reciprocal: boolean;

}

export interface Contact extends ContactInit {

    readonly id: string;
    readonly uid: string;
    readonly created: ISODateTimeString;

}

export type ContactRelArray = ReadonlyArray<ContactRelType>;

/**
 * The relationship type:
 *
 * - sharing: sharing documents with this user.
 * - friend: added them as a friend.
 *
 */
export type ContactRelType = 'shared' | 'friend';

export type ContactIDStr = string;
