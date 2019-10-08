import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Firestore} from '../firebase/Firestore';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {MachineID} from '../util/MachineIDs';

export class UserFeedbacks {

    public static async write(userFeedback: UserFeedback) {

        const firestore = await Firestore.getInstance();

        const id = Hashcodes.createRandomID();

        const ref = firestore.collection("user_feedback").doc(id);

        await ref.set(userFeedback);

    }

}

export interface UserFeedback {

    /**
     * The score they gave us.  This is important as I need this to prioritize
     * their feedback appropriately.
     */
    readonly netPromoterScore: NetPromoterScore | null;

    /**
     * Their actual text that they provided.
     */
    readonly text: string | null;

    readonly created: ISODateTimeString;

    readonly machine: MachineID;

    readonly version: string;

    // TODO: more fields including a unique/blinded ID for the user, the date
    // their account was created (so I can do cohorts for this)

}

export type NetPromoterScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

