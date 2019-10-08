import {FileLoader} from './FileLoader';
import {CacheRegistry} from '../../../backend/proxyserver/CacheRegistry';
import {PHZLoader} from './PHZLoader';
import {PDFLoader} from './PDFLoader';
import {LoadedFile} from './LoadedFile';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";

export class DefaultFileLoader extends FileLoader {

    private readonly fileRegistry: FileRegistry;

    private readonly cacheRegistry: CacheRegistry;

    private readonly pdfLoader: PDFLoader;

    private readonly phzLoader: PHZLoader;

    constructor(fileRegistry: FileRegistry, cacheRegistry: CacheRegistry) {
        super();
        this.fileRegistry = fileRegistry;
        this.cacheRegistry = cacheRegistry;
        this.pdfLoader = new PDFLoader(fileRegistry);
        this.phzLoader = new PHZLoader(cacheRegistry, fileRegistry);
    }

    public async registerForLoad(path: string): Promise<LoadedFile> {

        if (FilePaths.hasExtension(path, "pdf")) {
            return this.pdfLoader.registerForLoad(path);
        } else if (FilePaths.hasExtension(path, "phz")) {
            return this.phzLoader.registerForLoad(path);
        } else {
            throw new Error("Unable to handle file: " + path);
        }

    }

}
