import {Firebase} from '../firebase/Firebase';
import fetch, {RequestInit} from 'polar-shared/src/util/Fetch';
import {AccountPlan} from "./Account";

export class AccountActions {

    public static async cancelSubscription() {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeCancelSubscription/`;
        const data = await this.createAccountData();

        await this.executeAccountMethod(url, data);

    }

    public static async changePlan(plan: AccountPlan) {
        const url = `https://us-central1-polar-cors.cloudfunctions.net/StripeChangePlan/`;
        const accountData = await this.createAccountData();
        const data = {plan, ...accountData};

        await this.executeAccountMethod(url, data);

    }

    private static async executeAccountMethod(url: string, data: any) {

        const body = JSON.stringify(data);

        const init: RequestInit = {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body
        };

        const response = await fetch(url, init);

        if (response.status !== 200) {
            throw new Error("Request: " + response.status + ": " + response.statusText);
        }

    }

    private static async createAccountData(): Promise<AccountData> {

        const user = await Firebase.currentUser();

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
