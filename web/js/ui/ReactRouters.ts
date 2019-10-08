export class ReactRouters {
    /**
     * This is a big of a hack to support routes with hashes in them with react router.
     */
    public static createLocationWithPathnameHash() {

        const computePathname = () => {
            return document.location.hash ?
                document.location.pathname + '' + document.location.hash : document.location.pathname;

        };

        return {
            get pathname() {
                return computePathname();
            },
            get search() {
                return document.location.search;
            },
            get hash() {
                return document.location.hash;
            },
            state: null,
        };

    }

}
