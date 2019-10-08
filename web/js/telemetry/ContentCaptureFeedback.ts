import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Firestore} from '../firebase/Firestore';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {MachineID} from '../util/MachineIDs';

export class ContentCaptureFeedbacks {

    public static async write(contentCaptureFeedback: ContentCaptureFeedback) {

        const firestore = await Firestore.getInstance();

        const id = Hashcodes.createRandomID();

        const ref = firestore.collection("content_capture_feedback").doc(id);

        await ref.set(contentCaptureFeedback);

    }

}

interface ContentCaptureFeedback {

    /**
     * The URL that they're providing feedback for.
     */
    readonly url: string;

    readonly rating: Rating;

    /**
     * Their actual text that they provided.
     */
    readonly text: string | null;

    readonly created: ISODateTimeString;

    readonly machine: MachineID;

}

type Rating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

