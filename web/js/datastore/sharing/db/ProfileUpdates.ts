import {ProfileInit} from './Profiles';
import {JSONRPC} from '../rpc/JSONRPC';

export class ProfileUpdates {

    public static async exec(request: ProfileUpdateRequest) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

export interface ProfileUpdateRequest extends ProfileInit {

}
