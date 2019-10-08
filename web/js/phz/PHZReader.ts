
import JSZip from 'jszip';
import {Resources} from './Resources';
import {ResourceEntry} from './ResourceEntry';
import {Files} from 'polar-shared/src/util/Files';
import {CompressedReader} from './CompressedReader';
import {Captured} from '../capture/renderer/Captured';
import {PathStr} from "polar-shared/src/util/Strings";

export class PHZReader implements CompressedReader {

    public zip?: JSZip;

    public metadata: any = {};

    public resources: Resources = new Resources();

    private cache: {[key: string]: any} = {};

    /**
     * Init must be called to load the entries which we can work with.
     *
     */
    public async init(source: PathStr | Blob) {

        // TODO: migrate this to fs.createReadStream even though this is async
        // it reads all the data into memory. Make sure this method is
        // completely async though.

        const data = typeof source === 'string' ? await Files.readFileAsync(source) : source;

        this.zip = new JSZip();
        // this.zip.support = {
        //     arraybuffer: true,
        //     uint8array: true,
        //     blob: true,
        //     nodebuffer: true
        // };

        await this.zip.loadAsync(data);

    }

    public async getMetadata(): Promise<Captured | null> {

        try {
            return await this.getCached("metadata.json", "metadata");
        } catch (e) {
            return Promise.resolve(null);
        }

    }

    /**
     * Get just the resources from the metadata.
     */
    public async getResources(): Promise<Resources> {

        try {
            return await this.getCached("resources.json", "resources");
        } catch (e) {
            return Promise.resolve(new Resources());
        }

    }

    public async getCached(path: string, key: string): Promise<any> {

        let cached = this.cache[key];
        if (cached !== undefined && cached !== null) {
            // return the cache version if it's already read properly.
            return cached;
        }

        const buffer = await this._readAsBuffer(path);

        if (! buffer) {
            throw new Error("No buffer for path: " + path);
        }

        cached = JSON.parse(buffer.toString("UTF-8"));

        this.cache[key] = cached;

        return cached;

    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     */
    public async getResource(resourceEntry: ResourceEntry): Promise<Buffer> {
        return await this._readAsBuffer(resourceEntry.path);
    }

    public async getResourceAsStream(resourceEntry: ResourceEntry): Promise<NodeJS.ReadableStream> {
        return await this._readAsStream(resourceEntry.path);
    }

    public async getResourceAsBlob(resourceEntry: ResourceEntry): Promise<Blob> {
        return await this._readAsBlob(resourceEntry.path);
    }

    public async close() {
        // we just have to let it GC
        this.zip = undefined;
    }

    /**
     * Return a raw buffer with no encoding.
     *
     * @param path
     * @private
     */
    private async _readAsBuffer(path: string): Promise<Buffer> {

        const zipFile = await this.getZipFile(path);
        const arrayBuffer = await zipFile.async('arraybuffer');
        return Buffer.from(arrayBuffer);

    }

    private async _readAsStream(path: string): Promise<NodeJS.ReadableStream> {
        const zipFile = await this.getZipFile(path);
        return zipFile.nodeStream();
    }

    private async _readAsBlob(path: string): Promise<Blob> {
        const zipFile = await this.getZipFile(path);
        return await zipFile.async('blob');
    }

    private async getZipFile(path: string): Promise<JSZip.JSZipObject>  {

        if (this.zip === undefined) {
            throw new Error("No zip.");
        }

        const zipFile = this.zip.file(path);


        if (!zipFile) {
            throw new CachingException("No zip entry for path: " + path);
        }

        return zipFile;

    }

}

export class CachingException extends Error {

    public constructor(message: string) {
        super(message);
    }

}
