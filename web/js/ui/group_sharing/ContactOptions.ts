import {ContactProfile} from './GroupSharingRecords';
import {UserRef} from '../../datastore/sharing/rpc/UserRefs';
import {ContactOption} from './ContactsSelector';

export class ContactOptions {

    public static toContactOptions(contactProfiles: ReadonlyArray<ContactProfile>): ReadonlyArray<ContactOption> {

        const contactProfilesMapped: ReadonlyArray<ContactOption | undefined>
            = contactProfiles.map(current => {

            if (current.profile) {

                const {profile} = current;
                const {contact} = current;

                const createLabel = () => {

                    if (profile.name && profile.handle && contact.email) {
                        return `${profile.name} (${contact.email}) AKA ${profile.handle}`;
                    }

                    if (profile.name && contact.email) {
                        return `${profile.name} (${contact.email})`;
                    }

                    return profile.name || profile.handle || contact.email || "";

                };

                const label = createLabel();

                return {
                    value: current.profile.id,
                    label
                };

            } else if (current.contact.email) {

                return {
                    value: current.contact.email!,
                    label: current.contact.email!
                };

            } else {

                console.warn("Broken profile information: ", current);

                // I think there is just a profileID here and we're not properly
                // resolving it to show it in the UI.

                // this one is broken
                return undefined;

            }

        });

        return contactProfilesMapped
                .filter(current => current !== undefined)
                .map(current => current!);

    }

    public static toUserRefs(options: ReadonlyArray<ContactOption> = []): ReadonlyArray<UserRef> {

        return options.map(current => {

            if (current.value.indexOf("@") !== -1) {

                return {
                    value: current.value,
                    type: 'email'
                };

            }

            return {
                value: current.value,
                type: 'profileID'
            };

        });

    }

}
