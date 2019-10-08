import {SpectronRendererState} from '../test/SpectronRenderer';
import * as firebase from './lib/firebase';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Firebase} from './Firebase';
import {ASYNC_NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Preconditions} from 'polar-shared/src/Preconditions';

const log = Logger.create();

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

Preconditions.assertPresent(FIREBASE_USER, 'FIREBASE_USER');
Preconditions.assertPresent(FIREBASE_PASS, 'FIREBASE_PASS');

/**
 * A simple test runner harness that connect to firebase via direct auth and
 * runs tests against firebase directly.
 *
 * @ElectronRendererContext
 */
export class FirebaseTestRunner {

    private readonly state: SpectronRendererState;

    private currentUser: firebase.User | null = null;

    // noinspection TsLint
    private testingFunction: () => Promise<void> = ASYNC_NULL_FUNCTION;

    constructor(state: SpectronRendererState) {
        this.state = state;
    }

    public async run(testingFunction: () => Promise<void>) {

        this.testingFunction = testingFunction;

        window.addEventListener('load', async () => {

            this.init()
                .catch(err => log.error("Caught error on init", err));

        });

    }

    public async init() {

        const app = Firebase.init();

        if (firebase.auth().currentUser === null) {

            // bring up the UI so that we can login.
            // FirebaseUIAuth.login();

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            console.log("Authenticated with Firebase successfully.");
        }

        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public async onAuth(user: firebase.User | null) {

        this.currentUser = user!;

        if (user) {

            log.notice("Working with user: " + user.email);

            const accountDetailsElement = document.getElementById("account-details");

            if (isPresent(accountDetailsElement)) {
                accountDetailsElement!.innerText = JSON.stringify(firebase.auth().currentUser, null, "  ");
            }

            await this.testingFunction();

            mocha.run((nrFailures: number) => {

                this.state.testResultWriter.write(nrFailures === 0)
                    .catch(err => console.error("Unable to write results: ", err));

            });

        } else {

            log.error("No user");

            // in automated testing we have to fail here because no cookies are
            // present to run this test and someone needs to run the test
            // manually to login to store data
            await this.state.testResultWriter.write(false);

        }

    }

    public onAuthError(firebaseError: firebase.auth.Error) {

        log.error("Firebase error: ", firebaseError);

        this.state.testResultWriter.write(false)
            .catch(err => log.error("Could not send result: ", err));
    }

}
