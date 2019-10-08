import {Profile, ProfileIDStr, Profiles} from "./Profiles";
import {Optional} from "polar-shared/src/util/ts/Optional";

/**
 * Provides a way to join against profiles so that we can resolve the live profile
 * metadata.  We then keep the original record and the profile and profileID back
 * to back so that we can just use the right record.
 */
export class ProfileJoins {

    public static async record<T extends ProfileIDRecord>(value?: T): Promise<ProfileRecord<T> | undefined> {

        if (! value) {
            return undefined;
        }

        const joined = await this.join([value]);

        if (joined.length > 0) {
            return joined[0];
        }

        return undefined;

    }

    public static async join<T extends ProfileIDRecord>(values: ReadonlyArray<T>): Promise<ReadonlyArray<ProfileRecord<T>>> {

        const resolvedProfiles: {[id: string]: Profile} = {};

        const promises = values.map(value => {

            const handler = async () => {

                const {profileID} = value;

                if (! profileID) {
                    // nothing to do as there is no profileID
                    return;
                }

                const profile = await Profiles.get(profileID);

                if (profile) {
                    resolvedProfiles[profileID] = profile;
                }

            };

            return handler();

        });

        // now wait all the promises in parallel
        await Promise.all(promises);

        return values.map((value): ProfileRecord<T> => {

            const {profileID} = value;
            const profile = profileID ? Optional.of(resolvedProfiles[profileID]).getOrUndefined() : undefined;

            return {
                value,
                profile,
                profileID
            };

        });

    }

}

export interface ProfileIDRecord {
    readonly profileID?: ProfileIDStr;
}

export interface ProfileRecord<T extends ProfileIDRecord> {

    /**
     * The value that we looked up the profileID on...
     */
    readonly value: T;

    /**
     * The profile that we resolved against.
     */
    readonly profile?: Profile;

    readonly profileID?: ProfileIDStr;

}
