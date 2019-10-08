import {GroupIDStr} from "../../Datastore";
import {DatastoreCollection} from "../../FirebaseDatastore";
import {Firestore} from "../../../firebase/Firestore";
import * as firebase from "firebase";
import GetOptions = firebase.firestore.GetOptions;
import {Visibility} from "polar-shared/src/datastore/Visibility";

export class DocPermissions {

    public static async get(id: DocPermissionIDStr, options?: GetOptions) {

        const firestore = await Firestore.getInstance();

        const ref = firestore
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        const doc = await ref.get(options);

        if (doc.exists) {
            return <DocPermission> doc.data();
        } 

        return undefined;

    }

}

export interface DocPermission {

    // the visibility of this record.
    readonly visibility: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr>;

}

export type DocPermissionIDStr = string;

