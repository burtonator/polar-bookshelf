import {Preconditions} from 'polar-shared/src/Preconditions';
import {Fingerprints} from '../../../util/Fingerprints';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FileLoader} from './FileLoader';
import {CacheRegistry} from '../../../backend/proxyserver/CacheRegistry';
import {WebResource} from '../../../electron/webresource/WebResource';
import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {LoadedFile} from './LoadedFile';
import {Descriptors} from '../../../viewer/html/Descriptors';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";

const log = Logger.create();

const LOAD_STRATEGY: LoadStrategy = 'portable';

export class PHZLoader extends FileLoader {

    constructor(private cacheRegistry: CacheRegistry,
                private fileRegistry: FileRegistry) {
        super();
    }

    public async registerForLoad(path: string): Promise<LoadedFile> {

        Preconditions.assertNotNull(this.cacheRegistry);
        Preconditions.assertNotNull(this.fileRegistry);

        if (LOAD_STRATEGY === 'portable') {
            return this.doPortable(path);
        } else {
            return await this.doElectron(path);
        }

    }

    private doPortable(path: string) {

        const filename = FilePaths.basename(path);

        const fileMeta = this.fileRegistry.registerFile(path);

        const appURL = PHZLoader.createViewerURL(fileMeta.url, filename);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

    public static createViewerURL(fileURL: string, filename: string) {

        const fingerprint = Fingerprints.create(filename);

        const params = {
            file: encodeURIComponent(fileURL),
            filename: encodeURIComponent(filename),
            fingerprint
        };

        return ResourcePaths.resourceURLFromRelativeURL(`/htmlviewer/index.html?file=${params.file}&filename=${params.filename}&fingerprint=${params.fingerprint}&zoom=page-width&strategy=${LOAD_STRATEGY}`, false);

    }

    private async doElectron(path: string) {

        const filename = FilePaths.basename(path);

        // register the phz.  the cache interceptor should do the rest.
        const cachedRequestsHolder = await this.cacheRegistry.registerFile(path);

        log.info("cachedRequestsHolder: " + JSON.stringify(cachedRequestsHolder));

        // get the cache metadata for the primary URL as it will work for the
        // subsequent URLs too.

        const cachedRequest = cachedRequestsHolder.cachedRequests[cachedRequestsHolder.metadata.url];

        log.info("Going to load URL: " + cachedRequest.url);

        const descriptor = cachedRequestsHolder.metadata;
        const descriptorJSON = JSON.stringify(descriptor);

        // we don't need the content represented twice.

        const basename = FilePaths.basename(path);

        // TODO: this is workaround until we enable zip files with embedded
        // metadata / descriptors
        const fingerprint = Fingerprints.create(basename);

        const appPath = ResourcePaths.resourceURLFromRelativeURL('/htmlviewer/index.html', false);

        const filenameParam = encodeURIComponent(filename);

        const fileParam = encodeURIComponent(cachedRequest.url);
        const descriptorParam = encodeURIComponent(descriptorJSON);

        const queryData = `?file=${fileParam}&fingerprint=${fingerprint}&descriptor=${descriptorParam}&filename=${filenameParam}`;
        const appURL = appPath + queryData;

        const docDimensions = Descriptors.calculateDocDimensions(descriptor);

        return {
            webResource: WebResource.createURL(appURL),
            title: descriptor.title,
            docDimensions
        };

    }


}

export type LoadStrategy = 'electron' | 'portable';
