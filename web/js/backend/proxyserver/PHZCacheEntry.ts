/**
 * A cache entry backed by a phz file.
 */
import {CacheEntry, DataCallback, ICacheEntry} from "./CacheEntry";
import {PHZReader} from '../../phz/PHZReader';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {ResourceEntry} from '../../phz/ResourceEntry';
import {CompressedReader} from "../../phz/CompressedReader";

export class PHZCacheEntry extends CacheEntry implements IPHZCacheEntry {

    public phzReader: CompressedReader;

    public resourceEntry: ResourceEntry;

    constructor(opts: IPHZCacheEntry) {

        super(opts);

        this.phzReader = opts.phzReader;
        this.resourceEntry = opts.resourceEntry;

        Preconditions.assertNotNull(this.phzReader, "phzReader");
        Preconditions.assertNotNull(this.resourceEntry, "resourceEntry");

        Object.defineProperty(this, 'phzReader', {
            value: this.phzReader,
            enumerable: false
        });

    }

    public async handleData(callback: DataCallback): Promise<boolean> {

        const buffer = await this.phzReader.getResource(this.resourceEntry);
        callback(buffer);
        return false;

    }

    public async toBuffer(): Promise<Buffer> {
        return await this.phzReader.getResource(this.resourceEntry);
    }

    public async toStream(): Promise<NodeJS.ReadableStream> {
        return await this.phzReader.getResourceAsStream(this.resourceEntry);
    }

}

export interface IPHZCacheEntry extends ICacheEntry {

    phzReader: CompressedReader;

    resourceEntry: ResourceEntry;

}
