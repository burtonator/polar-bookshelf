export class ReactRouterLinks {

    public static isActive(target: Target) {

        const {pathname, hash} = target;

        const canonicalizeHash = (hash?: string): string => {

            if (! hash) {
                return "#";
            }

            if (! hash.startsWith("#")) {
                return "#" + hash;
            }

            return hash;

        };

        return document.location.pathname === pathname &&
               canonicalizeHash(document.location.hash) === canonicalizeHash(hash);

    }

}

export interface Target {
    readonly pathname: string;
    readonly hash?: string;
}
