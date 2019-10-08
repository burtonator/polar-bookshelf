
// https://expressjs.com/en/4x/api.html#req
// https://expressjs.com/en/4x/api.html#res

import {isPresent} from 'polar-shared/src/Preconditions';
import {Objects} from '../../util/Objects';

export abstract class CacheEntry implements ICacheEntry {

    public method: string;
    public url: string;
    public headers: {[key: string]: string | string[]} = {};
    public statusCode = 200;
    public statusMessage = "OK";
    public contentType = "text/html";
    public mimeType = "text/html";
    public encoding = "UTF-8";
    public contentLength?: number;
    public docTypeFormat?: DocTypeFormat;

    protected constructor(options: ICacheEntry) {

        this.method = "GET";

        this.url = options.url;

        Object.assign(this, options);

        // make sure we have defaults for everything.
        Objects.defaults(this, {
            method: "GET",
            headers: {},
            statusCode: 200,
            statusMessage: "OK",
            contentType: "text/html",
            mimeType: "text/html",
            encoding: "UTF-8",
        });

    }

    /**
     * Handle data for this request.  The callback is called as a function
     * with one 'data' parameter which is a buffer of data to write.
     *
     * The handleData should return false when there is no more data to handle.
     *
     */
    public abstract async handleData(callback: DataCallback): Promise<boolean>;

    /**
     */
    public abstract async toBuffer(): Promise<Buffer>;

    public abstract async toStream(): Promise<NodeJS.ReadableStream>;

}

export interface DataCallback {
    // noinspection TsLint
    (data: Buffer): void;
}

export interface ICacheEntry {

    method: string;

    /**
     * The URL to request.
     */
    url: string;

    /**
     * The request headers.
     *
     */
    headers: {[key: string]: string | string[]};

    /**
     * The status code for this cache entry.
     */
    statusCode: number;

    /**
     * The status message.
     */
    statusMessage: string;

    /**
     *
     * The content type of this content.  Default is text/html.  We use
     * extensions of the files based on the content type.
     *
     * @type {string}
     */
    contentType: string;

    /**
     * The decoded mine type. The contentType can include an encoding so
     * contentType can be broken down into mimeType + encoding.
     *
     */
    mimeType: string;

    encoding: string;

    /**
     * The content length of the data, if known
     */
    contentLength?: number;

    docTypeFormat?: DocTypeFormat;

}

/**
 * Return the document format of the underlying document by determining if
 * it's XML or HTML
 */
export type DocTypeFormat = 'html' | 'xml';
