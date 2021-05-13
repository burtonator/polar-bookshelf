import firebase from 'firebase/app'
import 'firebase/auth';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import { Latch } from 'polar-shared/src/util/Latch';

const log = Logger.create();

const PROJECTS: {[project: string]: any} = {

    "polar-test2": {
        apiKey: "AIzaSyByrYfWcYQAFaBRroM-M96lWCyX0cp3SKg",
        authDomain: "polar-test2.firebaseapp.com",
        databaseURL: "https://polar-test2.firebaseio.com",
        projectId: "polar-test2",
        storageBucket: "polar-test2.appspot.com",
        messagingSenderId: "1051837764975",
        appId: "1:1051837764975:web:8f9f8fd4a3a9b76b"
    },
    "prod": {
        apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
        authDomain: "polar-32b0f.firebaseapp.com",
        databaseURL: "https://polar-32b0f.firebaseio.com",
        projectId: "polar-32b0f",
        storageBucket: "polar-32b0f.appspot.com",
        messagingSenderId: "919499255851",
        // timestampsInSnapshots: true
    }

};

export class Firebase {

    private static app?: firebase.app.App;

    private static userLatch = new Latch<boolean>();

    private static user?: firebase.User | null;

    /**
     * Perform init of Firebase with our auth credentials.
     */
    public static init(): firebase.app.App {

        if (this.app) {
            return this.app;
        }

        try {

            log.notice("Initializing firebase...");

            this.app = this.doInit();

            return this.app;

        } finally {
            log.notice("Initializing firebase...done");
        }

    }

    private static doInit() {

        const project = process.env.POLAR_TEST_PROJECT || 'prod';

        log.info("Connecting to firebase with project: " + project);

        Preconditions.assertPresent(project, "project");

        const config = PROJECTS[project];

        Preconditions.assertPresent(config, "config");

        const app = firebase.initializeApp(config);

        this.startListeningForUser();

        return app;

    }

    /**
     * This API is sort of broken by design
     *
     * https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
     *
     */
    private static startListeningForUser() {

        const auth = firebase.auth();

        const onNext = (user: firebase.User | null) => {

            console.log("firebase: auth state next: ", user);
            this.userLatch.resolve(true);
            return this.user = user;

        }

        const onError = (err: firebase.auth.Error) => {
            console.error("firebase: auth state error", err);
        }

        auth.onAuthStateChanged(onNext, onError);

    }

    public static async currentUserAsync(): Promise<firebase.User | undefined> {
        await this.userLatch.get();
        Firebase.init();
        return this.user || undefined;
    }

    public static async currentUserID(): Promise<UserIDStr | undefined> {
        const user = await this.currentUserAsync();
        return user?.uid;
    }

}

export type UserIDStr = string;

export type UserID = UserIDStr;


