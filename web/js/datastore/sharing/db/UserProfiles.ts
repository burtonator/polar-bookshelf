import {Profile, ProfileIDStr, Profiles} from "./Profiles";
import {CacheFirstThenServerGetOptions, GetOptions} from "../../../firebase/firestore/DocumentReferences";
import {isPresent} from 'polar-shared/src/Preconditions';

export class UserProfiles {

    public static async get(profileID: ProfileIDStr,
                            opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<UserProfile | undefined> {

        const currentUserProfile = await Profiles.currentProfile(opts);
        const profile = await Profiles.get(profileID, opts);

        if (! profile) {
            return undefined;
        }

        const self = isPresent(currentUserProfile) &&
                     currentUserProfile!.id === profile.id;

        return {self, profile};

    }

    public static async currentUserProfile(opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<UserProfile | undefined> {
        const profile = await Profiles.currentProfile(opts);

        if (! profile) {
            return undefined;
        }

        return {self: true, profile};
    }

}


export interface UserProfile {

    readonly profile: Profile;

    /**
     * True if this profile represents myself.
     */
    readonly self: boolean;

}
