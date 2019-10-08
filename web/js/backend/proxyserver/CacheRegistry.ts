import {Preconditions} from 'polar-shared/src/Preconditions';
import {CachedRequestsHolder} from './CachedRequestsHolder';
import {CacheEntry} from './CacheEntry';
import {CachedRequest} from './CachedRequest';
import {CacheEntriesFactory} from './CacheEntriesFactory';
import {forDict} from 'polar-shared/src/util/Functions';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class CacheRegistry {

    private readonly registry: {[url: string]: CacheEntry} = {};

    /**
     *
     */
    constructor() {
        this.registry = {};
    }

    /**
     *
     * @param path
     * @return {Promise<CachedRequestsHolder>}
     */
    public async registerFile(path: string) {

        const cacheEntriesHolder = await CacheEntriesFactory.createEntriesFromFile(path);

        const cachedRequestsHolder = new CachedRequestsHolder({
            metadata: cacheEntriesHolder.metadata
        });

        if(! cacheEntriesHolder.cacheEntries) {
            throw new Error("No cache entries!");
        }

        forDict(cacheEntriesHolder.cacheEntries, (key, cacheEntry) => {
            const cacheMeta = this.register(cacheEntry);
            cachedRequestsHolder.cachedRequests[cacheMeta.url] = cacheMeta;
        });

        return cachedRequestsHolder;

    }


    /**
     * Register a file to be served with the given checksum.  Then return
     * metadata about what we registered including how to fetch the file we
     * registered.
     *
     */
    public register(cacheEntry: CacheEntry) {

        Preconditions.assertNotNull(cacheEntry, "cacheEntry");
        Preconditions.assertNotNull(cacheEntry.statusCode, "cacheEntry.statusCode");
        Preconditions.assertNotNull(cacheEntry.headers, "cacheEntry.headers");

        const url = cacheEntry.url;

        Preconditions.assertNotNull(url, "url");

        log.info(`Registered new cache entry at: ${url}`);

        this.registry[url] = cacheEntry;

        return new CachedRequest({
            url
        });

    }

    /**
     * Return true if the given hashcode is registered.
     *
     * @param url The key we should fetch.
     */
    public hasEntry(url: string) {
        return url in this.registry;
    }

    /**
     * Get metadata about the given key.
     *
     * @return {CacheEntry}
     */
    public get(url: string): CacheEntry {

        if (!this.hasEntry(url)) {
            throw new Error("URL not registered: " + url);
        }

        return this.registry[url];

    }

}
