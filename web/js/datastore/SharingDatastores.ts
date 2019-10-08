import {FirebaseDocMetaID} from './FirebaseDatastore';
import {isPresent} from 'polar-shared/src/Preconditions';
import {SharingDatastore} from './SharingDatastore';
import {URLStr} from "polar-shared/src/util/Strings";


export class SharingDatastores {

    /**
     * Create a sharing datastore from the given URL.
     */
    public static create(url: URLStr = this.currentURL()) {

        const params = this.parseURL(url);

        if (! params) {
            throw new Error("Not a sharing URL: " + url);
        }

        return new SharingDatastore(params.doc, params.fingerprint);

    }

    /**
     * Return true if the current URL is a sharing URL.
     */
    public static isSupported(): boolean {

        const params = this.parseURL();
        return params !== undefined;

    }

    private static parseURL(url: URLStr = this.currentURL()): SharingParams | undefined {

        const parsedURL = new URL(url);

        if (parsedURL.hostname.endsWith(".getpolarized.io")) {

            const shared = parsedURL.searchParams.get("shared");
            const doc = parsedURL.searchParams.get("doc");
            const fingerprint = parsedURL.searchParams.get("fingerprint");

            if (shared === 'true' && isPresent(doc)) {

                return {
                    shared: true,
                    doc: doc!,
                    fingerprint: fingerprint!
                };

            }

        }

        return undefined;

    }

    private static currentURL(): URLStr {
        return document.location!.href;
    }

}

interface SharingParams {
    readonly shared: boolean;
    readonly doc: FirebaseDocMetaID;
    readonly fingerprint: string;
}
