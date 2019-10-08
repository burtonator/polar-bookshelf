import {forDict} from 'polar-shared/src/util/Functions';
import {CacheEntriesHolder} from './CacheEntriesHolder';
import {DiskCacheEntry} from './DiskCacheEntry';
import {PHZCacheEntry} from './PHZCacheEntry';
import {CachingPHZReader} from '../../phz/CachingPHZReader';

import fs from 'fs';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

/**
 * Cache entry which is just buffered in memory.
 */
export class CacheEntriesFactory {

    /**
     *
     * @param path
     */
    public static async createEntriesFromFile(path: string): Promise<CacheEntriesHolder> {

        if (path.endsWith(".chtml")) {
            return CacheEntriesFactory.createFromCHTML(path);
        } else if (path.endsWith(".phz")) {
            return CacheEntriesFactory.createFromPHZ(path);
        } else {
            throw new Error("Unable to handle file type for path: " + path);
        }

    }

    public static createFromHTML(url: string, path: string) {

        // TODO: stat the file so that we can get the Content-Length

        return new DiskCacheEntry({
            url,
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            },
            statusCode: 200,
            statusMessage: "OK",
            path
        });

    }

    /**
     * Read from a static CHTML file which has the URL within the metadata.
     *
     * @param path
     * @return Promise<CacheEntriesHolder>
     */
    public static async createFromPHZ(path: string) {

        // load the .json data so we have the URL.

        const cachingPHZReader = new CachingPHZReader(path);

        const resources = await cachingPHZReader.getResources();

        const cacheEntriesHolder = new CacheEntriesHolder({});

        cacheEntriesHolder.metadata = await cachingPHZReader.getMetadata();

        Dictionaries.forDict(resources.entries, (key, resourceEntry) => {

            const resource = resourceEntry.resource;

            const url = resourceEntry.resource.url;

            if (!url) {
                throw new Error("No url");
            }

            // TODO: we need a way to keep the CacheEntry and Resource fields
            // all in sync... Maybe have them all extend from the same base
            // object

            const cacheEntry = new PHZCacheEntry({
                url,
                method: resource.method,
                headers: resource.headers,
                statusCode: resource.statusCode,
                statusMessage: resource.statusMessage || "OK",
                contentType: resource.contentType,
                docTypeFormat: resource.docTypeFormat,
                mimeType: resource.encoding,
                encoding: resource.encoding,
                phzReader: cachingPHZReader,
                resourceEntry
            });

            cacheEntriesHolder.cacheEntries[url] = cacheEntry;

        });

        return cacheEntriesHolder;

    }


    /**
     * Read from a static CHTML file which has the URL within the metadata.
     *
     * @param path
     * @return Promise<CacheEntriesHolder>
     */
    public static async createFromCHTML(path: string) {

        // load the .json data so we have the URL.

        const jsonPath = path.replace(".chtml", "") + ".json";

        const json = fs.readFileSync(jsonPath);

        const data = JSON.parse(json.toString("UTF-8"));

        let url = data.url;

        // we can't serve this via HTTPS.. only HTTP which is cached locally.
        url = url.replace(/^https:/, "http:");

        // TODO: stat the file so that we can get the Content-Length

        return new CacheEntriesHolder({
            metadata: {
                url
            },
            cacheEntries: {
                url: new DiskCacheEntry({
                    url,
                    method: "GET",
                    headers: {
                        "Content-Type": "text/html"
                    },
                    statusCode: 200,
                    statusMessage: "OK",
                    path
                })
            }
        });

    }

}
