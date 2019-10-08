import {DocTypeFormat} from '../capture/renderer/Captured';

export class Resource {

    /**
     * Unique ID representing this resource in this archive.
     */
    public id: string;

    /**
     * The created time as an ISO8601 string.
     *
     */
    public created: string;

    /**
     */
    public url: string;

    /**
     * The content length of the content or null when unknown.
     *
     */
    public contentLength: string;

    /**
     */
    public title: string;

    /**
     *
     */
    public description: string;

    /**
     * Extended metadata for this resource.
     *
     */
    public meta: {} = {};

    /**
     *
     * The content type of this content.  Default is text/html.  We use
     * extensions of the files based on the content type.
     *
     */
    public contentType = "text/html";

    public mimeType = "text/html";

    public encoding = "UTF-8";

    /**
     * The HTTP request method.
     *
     */
    public method = "GET";

    /**
     * The status code for this content.
     *
     */
    public statusCode = 200;

    public statusMessage?: string;

    /**
     *
     */
    public headers: {[key: string]: string | string[]} = {};

    public docTypeFormat?: DocTypeFormat;

    constructor(opts: any) {

        this.id = opts.id;
        this.created = opts.created;
        this.url = opts.url;
        this.contentLength = opts.contentLength;
        this.title = opts.title;
        this.description = opts.description;
        this.docTypeFormat = opts.docTypeFormat;

        Object.assign(this, opts);

    }

}

export type DocTypeFormat = 'html' | 'xml';
