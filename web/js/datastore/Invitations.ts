import {RecordHolder} from './FirebaseDatastore';
import {Firestore} from '../firebase/Firestore';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Preconditions} from 'polar-shared/src/Preconditions';
import * as firebase from '../firebase/lib/firebase';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {Visibility} from "polar-shared/src/datastore/Visibility";

export class Invitations {

    /**
     * Send emails to a bunch of people...
     *
     * @param email
     */
    public static async sendInvites(...emailAddresses: string[]) {


        try {

            const firestore = await Firestore.getInstance();

            for (const emailAddress of emailAddresses) {

                const record = this.createRecord(emailAddress);

                await firestore
                    .collection('invitation')
                    .doc(record.id)
                    .set(record);

            }

            RendererAnalytics.event({category: 'invitations', action: 'invited-' + emailAddresses.length});

        } finally {
            // noop for now
        }

    }

    /**
     * Create the document that we will store in for the DocMeta
     */
    private static createRecord(to: EmailAddress) {

        const auth = firebase.app().auth();
        Preconditions.assertPresent(auth, "Not authenticated");

        const user = auth.currentUser;
        Preconditions.assertPresent(user, "Not authenticated");

        const uid = user!.uid;

        const id = Hashcodes.createRandomID();

        let image: Image | undefined;

        if (user!.photoURL) {

            image = {
                href: user!.photoURL!
            };

        }

        const profile: Profile = {
            email: user!.email!,
            name: Optional.of(user!.displayName).getOrUndefined(),
            image
        };

        const invitation: Invitation = {
            timestamp: ISODateTimeStrings.create(),
            from: profile,
            to
        };

        const recordHolder: RecordHolder<Invitation> = {
            uid,
            id,
            visibility: Visibility.PRIVATE,
            value: invitation
        };

        return recordHolder;

    }

}

export interface Invitation {

    readonly timestamp: ISODateTimeString;

    /**
     * The profile information of the person who send the invite.
     */
    readonly from: Profile;

    readonly to: EmailAddress;

}

export interface Profile {
    readonly email: EmailAddress;
    readonly name?: string;
    readonly image?: Image;

}

export interface Image {
    readonly href: string;
    readonly width?: number;
    readonly height?: number;
}

export type EmailAddress = string;

