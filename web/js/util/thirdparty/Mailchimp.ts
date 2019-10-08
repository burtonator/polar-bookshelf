import fetch, {RequestInit} from 'polar-shared/src/util/Fetch';
import {Arrays} from "polar-shared/src/util/Arrays";

export class Mailchimp {

    /**
     * Mailchimp has a horrible / nonexistant API so we're just going to hack
     * this for now.
     *
     */
    public static async subscribe(email: string, name: string) {

        const url = `https://us-central1-polar-cors.cloudfunctions.net/mailinglist/`;

        const userName = this.parseName(name);

        const data: Subscription = {
            email,
            ...userName
        };

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
            throw new Error("Mailchimp failed request: " + response.status + ": " + response.statusText);
        }

    }

    private static parseName(name: string): UserName {

        const nameParts = name.split(" ");

        const firstName = Arrays.first(nameParts) || "";
        const lastName = Arrays.last(nameParts) || "";

        return {firstName, lastName};

    }

}

interface UserName {
    readonly firstName: string;
    readonly lastName: string;
}

interface Subscription {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
