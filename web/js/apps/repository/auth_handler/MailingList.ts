/**
 * Make sure new Polar users are on the mailing list.
 */
import {AuthHandlers} from './AuthHandler';
import {Mailchimp} from '../../../util/thirdparty/Mailchimp';
import {RendererAnalytics} from '../../../ga/RendererAnalytics';
import {LocalPrefs} from '../../../util/LocalPrefs';

export class MailingList {

    /**
     * Use the auth handler to subscribe the user but only after they've
     * agreed to sign up on Firebase.
     */
    public static async subscribeWhenNecessary() {

        const authHandler = AuthHandlers.get();

        const optionalUserInfo = await authHandler.userInfo();

        if (optionalUserInfo.isPresent()) {

            const userInfo = optionalUserInfo.get();

            await LocalPrefs.markOnceExecuted('did-mailing-list', async () => {

                // NOTE: this will in some situations double subscribe people
                // but only if they migrate to a new machine and only if they
                // haven't also opted out.

                if (userInfo.email) {
                    try {
                        RendererAnalytics.event({category: 'mailing-list', action: 'subscribed'});
                        await Mailchimp.subscribe(userInfo.email, userInfo.displayName || "");
                    } catch (e) {
                        RendererAnalytics.event({category: 'mailing-list', action: 'failed'});
                        throw e;
                    }
                }

            });

        }

    }

}
