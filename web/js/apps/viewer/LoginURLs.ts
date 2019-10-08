
// TODO: unify all SignInSuccessURLs / LoginURLs and any use of signInSuccessUrl
export class LoginURLs {

    /**
     * Create a new login URL.
     *
     * @param signInSuccessUrl redir to a custom sign in URL.
     */
    public static create(signInSuccessUrl?: string) {

        if (signInSuccessUrl) {
            return '/login.html?signInSuccessUrl=' + encodeURIComponent(signInSuccessUrl);
        } else {
            return '/login.html';
        }

    }

}
