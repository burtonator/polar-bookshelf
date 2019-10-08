import {EmailStr, UserIDStr} from './Profiles';
import {HandleStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import * as firebase from '../../../firebase/lib/firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {Firebase} from "../../../firebase/Firebase";
import {DocumentReferences, GetOptions} from "../../../firebase/firestore/DocumentReferences";

export class ProfileOwners {

    public static readonly COLLECTION = 'profile_owner';

    public static async doc(id: UserIDStr): Promise<[HandleStr, DocumentReference]> {
        const firestore = await Firestore.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id?: UserIDStr, opts: GetOptions = {}): Promise<ProfileOwner | undefined> {

        if (! id) {
            const user = await Firebase.currentUser();

            if (! user) {
                return undefined;
            }

            id = user!.uid;
        }

        const [_, ref] = await this.doc(id);
        const doc = await DocumentReferences.get(ref, opts);
        return <ProfileOwner> doc.data();
    }

}

export interface ProfileOwner {

    readonly uid: UserIDStr;

    readonly profileID: ProfileIDStr;
    /**
     * The email for the profile.
     */
    readonly email: EmailStr;

    readonly handle?: HandleStr;

}
