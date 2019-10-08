import {Backend} from 'polar-shared/src/datastore/Backend';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {StoragePath} from './FirebaseDatastore';
import {StorageSettings} from './FirebaseDatastore';
import {FirebaseDocMetaID} from './FirebaseDatastore';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {CloudFunctions} from './firebase/CloudFunctions';
import {Firebase, UserID} from '../firebase/Firebase';
import * as firebase from '../firebase/lib/firebase';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {UserIDStr} from './sharing/db/Profiles';
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class FirebaseDatastores {

    private static user: firebase.User | null;

    private static initialized: boolean = false;

    /**
     * Perform init against the FirebaseDatastores to keep the current user for all operations.  This is a bit
     * of a hack in that it would be nice to have FB update this without it being async.
     */
    public static async init() {

        if (this.initialized) {
            return;
        }

        log.notice("Initializing FirebaseDatastores...");

        // set the current version before we return
        this.user = await Firebase.currentUser();

        const formatUser = (user: firebase.User | null) => {

            if (user) {
                return `${user.displayName}, uid=${user.uid}`;
            }

            return 'none';

        };

        log.notice("Initializing FirebaseDatastores...done", formatUser(this.user));

        // update in the background
        firebase.auth()
            .onAuthStateChanged((user) => this.user = user,
                                (err) => {
                                    log.error("Unable to handle user: ", err);
                                    this.user = null;
                                });

        this.initialized = true;

    }

    public static computeDatastoreGetFileURL(request: DatastoreGetFileRequest) {
        const endpoint = CloudFunctions.createEndpoint();
        return `${endpoint}/datastoreGetFile/?data=` + encodeURIComponent(JSON.stringify(request));
    }

    public static computeStoragePath(backend: Backend,
                                     fileRef: FileRef,
                                     uid: UserIDStr = FirebaseDatastores.getUserID()): StoragePath {

        const ext = FilePaths.toExtension(fileRef.name);

        const suffix = ext.map(value => {

                if ( ! value.startsWith('.') ) {
                    // if the suffix doesn't begin with a '.' then add it.
                    value = '.' + value;
                }

                return value;

            })
            .getOrElse('');

        const settings = this.computeStorageSettings(ext).getOrUndefined();

        let key: any;

        if (fileRef.hashcode) {

            key = {

                // We include the uid of the user to avoid the issue of user
                // conflicting on files and the ability to share them per file.
                // The cloud storage costs for raw binary files are
                // inconsequential so have one file per user.

                uid,
                backend,
                alg: fileRef.hashcode.alg,
                enc: fileRef.hashcode.enc,
                data: fileRef.hashcode.data,
                suffix

            };

        } else {

            // Build a unique name from the filename and the UUID of the user.
            // this shouldn't actually be used except in the cases of VERY old
            // datastores.
            //
            key = {
                uid,
                filename: fileRef.name
            };

        }

        const id = Hashcodes.createID(key, 40);

        const path = `${backend}/${id}${suffix}`;

        return {path, settings};

    }

    private static computeStorageSettings(optionalExt: Optional<string>): Optional<StorageSettings> {

        const PUBLIC_MAX_AGE_1WEEK = 'public,max-age=604800';

        const ext = optionalExt.getOrElse('').toLowerCase();

        if (ext === 'jpg' || ext === 'jpeg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/jpeg'
            });

        }

        if (ext === 'pdf') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'application/pdf'
            });

        }

        if (ext === 'png') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/png'
            });

        }

        if (ext === 'svg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/svg'
            });

        }

        // the fall through of cached data should work for PHZ files and other
        // types of binary data.

        return Optional.of({
            cacheControl: PUBLIC_MAX_AGE_1WEEK,
            contentType: 'application/octet-stream'
        });

    }


    // You can allow users to sign in to your app using multiple authentication
    // providers by linking auth provider credentials to an existing user account.
    // Users are identifiable by the same Firebase user ID regardless of the
    // authentication provider they used to sign in. For example, a user who signed
    // in with a password can link a Google account and sign in with either method
    // in the future. Or, an anonymous user can link a Facebook account and then,
    // later, sign in with Facebook to continue using your app.

    public static getUserID(): UserID {

        const app = firebase.app();

        const auth = app.auth();
        Preconditions.assertPresent(auth, "Not authenticated (no auth)");

        const user = this.user || auth.currentUser;
        Preconditions.assertPresent(user, "Not authenticated (no user)");

        return user!.uid;

    }

    public static computeDocMetaID(fingerprint: string,
                                   uid: UserID = FirebaseDatastores.getUserID()): FirebaseDocMetaID {

        return Hashcodes.createID(uid + ':' + fingerprint, 32);

    }

}

interface DatastoreGetFileRequest {
    readonly idToken: string;
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}
