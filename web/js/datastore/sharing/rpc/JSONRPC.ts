import {Firebase} from '../../../firebase/Firebase';
import {UserRequest} from '../db/UserRequest';
import {CloudFunctions} from '../../firebase/CloudFunctions';

export class JSONRPC {

    public static async exec<R, V>(func: string, request: R): Promise<V> {

        const app = Firebase.init();
        const user = app.auth().currentUser;

        if (! user) {
            throw new Error("User not authenticated");
        }

        const idToken = await user.getIdToken();

        const userRequest: UserRequest<R> = {
            idToken,
            request,
        };

        const endpoint = CloudFunctions.createEndpoint();

        const url = `${endpoint}/${func}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest)});

        if (response.status !== 200) {
            throw new JSONRPCError(response, "Unable to handle RPC: " + func);
        }

        return <V> await response.json();

    }

}

export class JSONRPCError extends Error {

    constructor(public readonly response: Response,
                message: string) {

        super(message);

    }

}
