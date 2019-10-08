import {URLs} from 'polar-shared/src/util/URLs';
import {Firebase} from '../../../firebase/Firebase';
import * as firebase from '../../../firebase/lib/firebase';
import {AppRuntime} from '../../../AppRuntime';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';

export interface AuthHandler {

    /**
     *
     * @param signInSuccessUrl The URL to redirect to if we're logging in to a
     * specific portion of the app.
     */
    authenticate(signInSuccessUrl?: string): void;

    status(): Promise<AuthStatus>;

    userInfo(): Promise<Optional<UserInfo>>;

    /**
     * This operation requires authentication so redirect the user to login.
     *
     * @param signInSuccessUrl
     */
    requireAuthentication(signInSuccessUrl?: string): Promise<void>;

}

export class AuthHandlers {

    public static get(): AuthHandler {

        if (AppRuntime.isElectron()) {

            // TODO: Electron can acutally use the BrowserAuthHandler
            // just fine...
            return new ElectronAuthHandler();

        } else if (AppRuntime.isBrowser()) {

            return new BrowserAuthHandler();

        } else {
            throw new Error("No auth handler.");
        }

    }

    public static async requireAuthentication(signInSuccessUrl?: string) {
        const authHandler = this.get();
        await authHandler.requireAuthentication(signInSuccessUrl);
    }


}

abstract class DefaultAuthHandler implements AuthHandler {

    public authenticate(signInSuccessUrl?: string): void {

        const createNewLocation = () => {

            if (signInSuccessUrl) {
                return signInSuccessUrl;
            }

            const base = URLs.toBase(document.location!.href);
            return new URL('/apps/repository/login.html', base).toString();

        };

        window.location.href = createNewLocation();

    }

    public async requireAuthentication(signInSuccessUrl?: string): Promise<void> {

        const userInfo = await this.userInfo();

        if (userInfo.isPresent()) {
            return;
        }

        this.authenticate(signInSuccessUrl);

    }

    public async userInfo(): Promise<Optional<UserInfo>> {
        return Optional.empty();
    }

    public abstract status(): Promise<AuthStatus>;

}

export abstract class FirebaseAuthHandler extends DefaultAuthHandler {

    public async userInfo(): Promise<Optional<UserInfo>> {

        Firebase.init();

        const user = await this.currentUser();

        if (user === null) {
            return Optional.empty();
        }

        return Optional.of({
            displayName: Optional.of(user.displayName).getOrUndefined(),
            email: Optional.of(user.email).get(),
            emailVerified: user.emailVerified,
            photoURL: Optional.of(user.photoURL).getOrUndefined(),
            uid: user.uid,
            creationTime: user.metadata.creationTime!
        });

    }

    protected async currentUser(): Promise<firebase.User | null> {
        return Firebase.currentUser();
    }

}

export class BrowserAuthHandler extends FirebaseAuthHandler {

    public async authenticate(): Promise<void> {

        Firebase.init();

        const base = URLs.toBase(document.location!.href);
        const newLocation = new URL('/login.html', base).toString();

        window.location.href = newLocation;

    }

    public async status(): Promise<AuthStatus> {

        Firebase.init();

        if (await this.currentUser() === null) {
            return 'needs-authentication';
        }

        return undefined;

    }

}

export class ElectronAuthHandler extends FirebaseAuthHandler {

    public async status(): Promise<AuthStatus> {

        return undefined;

    }

}

export type AuthStatus = 'needs-authentication' |  undefined;

/**
 * A generic UserInfo object for this auth handler. If there's no email the user
 * is anonymous and hasn't yet created an account.
 */
export interface UserInfo {

    readonly displayName?: string;
    readonly email: string;
    readonly emailVerified: boolean;
    readonly photoURL?: string;
    readonly uid: string;

    /**
     * The time the account was created on our end.
     */
    readonly creationTime: ISODateTimeString;

}
