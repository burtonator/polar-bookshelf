import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export abstract class WebResource {

    public abstract load(loader: URLLoader): void;

    public static createURL(url: string): WebResource {
        return new URLWebResource(url);
    }

}

export enum WebResourceType {
    URL = "URL"
}

class URLWebResource extends WebResource {

    public readonly type = WebResourceType.URL;

    public readonly url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    public load(loader: URLLoader): void {
        log.info("Loading URL: ", this.url);
        loader.loadURL(this.url);
    }

    public toString(): string {
        return `${this.type}: ${this.url}`;
    }

}

export interface URLLoader {
    loadURL(url: string): void;
}
