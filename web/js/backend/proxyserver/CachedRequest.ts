export class CachedRequest {

    /**
     */
    public url: string;

    /**
     */
    constructor(opts: any) {

        this.url = opts.url;

        Object.assign(this, opts);

    }

}
