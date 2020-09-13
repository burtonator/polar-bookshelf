import {Firebase} from '../firebase/Firebase';
import {Fetches, RequestInit} from 'polar-shared/src/util/Fetch';
import {Billing} from "polar-accounts/src/Billing";
import * as firebase from "firebase/app";
import 'firebase/auth';
import {LoginURLs} from "../apps/viewer/LoginURLs";
import {Firestore} from "../firebase/Firestore";

export namespace AccountActions {

    export async function logout() {

        await firebase.auth().signOut();
        const firestore = await Firestore.getInstance();
        await firestore.terminate();
        await firestore.clearPersistence();

    }

    export function login() {
        window.location.href = LoginURLs.create();
    }


    export async function cancelSubscription() {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeCancelSubscription/`;
        const data = await createAccountData();

        await executeAccountMethod(url, data);

    }

    export async function changePlan(plan: Billing.Plan, interval: Billing.Interval) {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeChangePlan/`;
        const accountData = await createAccountData();
        const data = {plan, interval, ...accountData};

        await executeAccountMethod(url, data);

    }

    async function executeAccountMethod(url: string, data: any) {

        const body = JSON.stringify(data);

        const init: RequestInit = {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body
        };

        const response = await Fetches.fetch(url, init);

        if (response.status !== 200) {
            throw new Error("Request: " + response.status + ": " + response.statusText);
        }

    }

    async function createAccountData(): Promise<AccountData> {

        const user = await Firebase.currentUserAsync();

        if (! user) {
            throw new Error("No account");
        }

        return {
            email: user.email!,
            uid: user.uid
        };

    }

}

interface AccountData {
    readonly email: string;
    readonly uid: string;
}
