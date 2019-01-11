// import firebase from 'firebase';
// import firebaseui from 'firebaseui';
// import AuthUI = firebaseui.auth.AuthUI;

import * as firebase from './lib/firebase';
import firebaseui from './lib/firebaseui';
import {Objects} from '../util/Objects';

// noinspection TsLint: max-line-length
const SIGN_IN_SUCCESS_URL = 'http://localhost:8005/content.html';
const TOS_URL = 'https://getpolarized.io/terms-of-service.html';
const PRIVACY_POLICY_URL = 'https://getpolarized.io/terms-of-service.html';

export class FirebaseUIAuth {

    /**
     * Start the login and render the login box to the given selector.
     *
     * @param containerSelector
     */
    public static login(partialOpts: Partial<FirebaseUIAuthOptions> = {}): firebaseui.auth.AuthUI {

        const opts = Objects.defaults(partialOpts, {
            containerSelector: '#firebaseui-auth-container',
            signInSuccessUrl: SIGN_IN_SUCCESS_URL
        });

        // FirebaseUI config.
        const uiConfig = {

            // popupMode: true,
            // signInFlow: 'popup',

            callbacks: {

                signInSuccessWithAuthResult: (authResult: any,
                                              redirectUrl: string) => {

                    return true;

                },

            },
            queryParameterForWidgetMode: 'mode',

            signInSuccessUrl: opts.signInSuccessUrl,
            signInOptions: [
                // Leave the lines as is for the providers you want to offer
                // your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
            ],
            // tosUrl and privacyPolicyUrl accept either url string or a
            // callback function. Terms of service url/callback.
            tosUrl: TOS_URL,

            // Privacy policy url/callback.
            privacyPolicyUrl: () => {
                window.location.assign(PRIVACY_POLICY_URL);
            }

        };

        // Initialize the FirebaseUI Widget using Firebase.
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start(opts.containerSelector, uiConfig);

        return ui;

    }

}

export interface FirebaseUIAuthOptions {
    readonly containerSelector: string;
    readonly signInSuccessUrl: string;
}
