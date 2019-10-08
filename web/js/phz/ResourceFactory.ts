import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Resource} from './Resource';

export class ResourceFactory {

    public static create(url: string, contentType: string) {

        const id = Hashcodes.createID(url, 20);
        const created = new Date().toISOString();
        const meta = {};
        const headers = {};
        return new Resource({id, url, created, meta, contentType, headers});

    }

    public static contentTypeToExtension(contentType: string) {
        if (contentType === "text/html") {
            return "html";
        } else {
            return "dat";
        }
    }

}
