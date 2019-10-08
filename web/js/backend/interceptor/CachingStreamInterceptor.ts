import {Logger} from 'polar-shared/src/logger/Logger';
import {CacheRegistry} from '../proxyserver/CacheRegistry';
import {CorrectStreamProtocolResponse, StreamInterceptors, StreamProtocolCallback} from './StreamInterceptors';
import InterceptStreamProtocolRequest = Electron.InterceptStreamProtocolRequest;
import {CacheStats} from './CacheStats';
import {isPresent} from 'polar-shared/src/Preconditions';

const log = Logger.create();

const HEADER_CONTENT_TYPE = "Content-Type";

export class CachingStreamInterceptor {

    private readonly cacheRegistry: CacheRegistry;
    private readonly cacheStats: CacheStats;

    constructor(cacheRegistry: CacheRegistry, cacheStats: CacheStats) {
        this.cacheRegistry = cacheRegistry;
        this.cacheStats = cacheStats;
    }

    public intercept(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug(`intercepted ${request.method} ${request.url}`);

        if (this.cacheRegistry.hasEntry(request.url)) {

            ++this.cacheStats.hits;

            this.interceptWithCache(request, callback)
                .catch(err => log.error("Unable to handle request: ", err));

        } else {
            ++this.cacheStats.misses;

            StreamInterceptors.handleWithNetRequest(request, callback);
        }

    }

    private async interceptWithCache(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug("HIT Going to handle with cache: ", request.url);

        const cacheEntry = this.cacheRegistry.get(request.url);

        const stream = await cacheEntry.toStream();

        log.debug("Returning intercepted cache stream: ", {headers: cacheEntry.headers, statusCode: cacheEntry.statusCode});

        // if there is no HTTP content type in the raw headers add it and rebuild it if necessary...

        const headers = Object.assign({}, cacheEntry.headers);

        if (!isPresent(headers[HEADER_CONTENT_TYPE])) {

            let newContentType: string | undefined;

            if (isPresent(cacheEntry.contentType)) {
                newContentType = cacheEntry.contentType;
            } else if (isPresent(cacheEntry.docTypeFormat)) {
                newContentType = 'text/' + cacheEntry.docTypeFormat;
            }

            if (isPresent(newContentType)) {
                log.info("Using new content type (missing in headers): " + newContentType);
                headers[HEADER_CONTENT_TYPE] = newContentType!;
            }

        }

        // add the charset if none is in the content type and we're sending text/html

        const hdr = (header: string): string | undefined => {

            if (headers[header] !== null) {

                const val = headers[header];
                if (typeof val === 'string') {
                    return val;
                } else {
                    return val[0];
                }

            }

            return undefined;

        };

        const charset = 'utf-8';
        const contentType = hdr(HEADER_CONTENT_TYPE);

        if (contentType && ['text/html', 'text/xml'].includes(contentType)) {
            headers[HEADER_CONTENT_TYPE] = `${contentType}; charset=${charset}`;
        }

        const streamProtocolResponse: CorrectStreamProtocolResponse = {
            headers,
            data: stream,
            statusCode: cacheEntry.statusCode
        };

        callback(streamProtocolResponse);

    }

}

export interface HeaderMap {
    [key: string]: string | string[];
}
