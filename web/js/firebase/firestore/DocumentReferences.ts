import * as firebase from '../lib/firebase';
import DocumentReference = firebase.firestore.DocumentReference;

export class DocumentReferences {

    /**
     * Smarter get semantics with a preference but we fail over to the server
     * if the cache isn't available.
     */
    public static async get(ref: DocumentReference, opts: GetOptions = {})   {

        if (opts.source === 'cache-then-server') {
            return this.getFromCacheFirstThenServer(ref);
        }

        return await ref.get({source: opts.source});

    }

    private static async getFromCacheFirstThenServer(ref: DocumentReference) {

        try {
            return await ref.get({source: 'cache'});
        } catch (err) {
            // TODO: we have to see if this is the PROPER error for a missing cache
            // entry
        }

        return await ref.get({source: 'server'});

    }

}

export interface GetOptions {

    /**
     * Describes whether we should get from server or cache.
     *
     * Setting to `default` (or not setting at all), causes Firestore to try to
     * retrieve an up-to-date (server-retrieved) snapshot, but fall back to
     * returning cached data if the server can't be reached.
     *
     * Setting to `server` causes Firestore to avoid the cache, generating an
     * error if the server cannot be reached. Note that the cache will still be
     * updated if the server request succeeds. Also note that latency-compensation
     * still takes effect, so any pending write operations will be visible in the
     * returned data (merged into the server-provided data).
     *
     * Setting to `cache` causes Firestore to immediately return a value from the
     * cache, ignoring the server completely (implying that the returned value
     * may be stale with respect to the value on the server.) If there is no data
     * in the cache to satisfy the `get()` call, `DocumentReference.get()` will
     * return an error and `QuerySnapshot.get()` will return an empty
     * `QuerySnapshot` with no documents.
     *
     * cache-then-server: first we fetch from the cache then we attempt the server.
     *
     */
    readonly source?: GetSource;

}

export type GetSource = 'default' | 'server'  | 'cache' | 'cache-then-server';

export class CacheFirstThenServerGetOptions implements GetOptions {
    public readonly source = 'cache-then-server';
}
