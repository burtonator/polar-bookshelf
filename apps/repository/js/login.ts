import {Firebase} from '../../../web/js/firebase/Firebase';
import {Nav} from '../../../web/js/ui/util/Nav';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from '../../../web/js/firebase/lib/firebase';
import {URLs} from 'polar-shared/src/util/URLs';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';

// TODO: unify all SignInSuccessURLs / LoginURLs and any use of signInSuccessUrl
class SignInSuccessURLs {

    /**
     * Get the right sign in URL either the default or a custom if specified
     * by a URL param.
     */
    public static get() {

        return Optional.first(this.getCustom(), this.getDefault()).get();

    }

    /**
     * Allow the user to set a custom signInSuccessUrl as a param.
     */
    private static getCustom(): string | undefined {

        const url = new URL(document.location!.href);

        return Optional.of(url.searchParams.get('signInSuccessUrl'))
            .getOrUndefined();

    }

    private static getDefault(): string {

        const base = URLs.toBase(document.location!.href);

        const signInPath
            = AppRuntime.isBrowser() ? "/" : '/#configured';

        return new URL(signInPath, base).toString();

    }

}

class InitialLogin {

    public static get() {

        const key = "has-login";

        const result = localStorage.getItem(key) !== 'true';

        localStorage.setItem(key, 'true');

        return result;

    }

    public static sentAnalytics() {

        if (this.get()) {

            const runtime = AppRuntime.type();
            const category = runtime + '-login';
            RendererAnalytics.event({category, action: 'initial'});

        }

    }

}


window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const signInSuccessUrl = SignInSuccessURLs.get();

        FirebaseUIAuth.login({signInSuccessUrl});

    }

    RendererAnalytics.pageviewFromLocation();

    InitialLogin.sentAnalytics();

});

Firebase.init();

