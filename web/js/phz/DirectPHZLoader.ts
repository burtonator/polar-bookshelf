
import {URLs} from 'polar-shared/src/util/URLs';
import {PHZReader} from './PHZReader';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Captured} from '../capture/renderer/Captured';
import {Resources} from './Resources';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {Blobs} from 'polar-shared/src/util/Blobs';
import {ResourceEntry} from './ResourceEntry';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DOM} from '../util/DOM';
import {PathStr, URLStr} from "polar-shared/src/util/Strings";
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

/**
 * Loads PHZs directly by opening them, decompressing them, and parsing the HTML
 * and then replacing the iframes directly.
 */
export class DirectPHZLoader {

    private readonly linkPromises: LinkPromise[] = [];

    constructor(private resource: PathStr | URLStr,
                private phzReader: PHZReader,
                private resources: Resources,
                private metadata: Captured | null) {

    }

    public async load(): Promise<Optional<Captured>> {

        try {

            if (this.metadata) {

                const url = this.metadata.url;

                await this.loadDocument(url, this.resources);

                return Optional.of(this.metadata);

            } else {
                log.warn("Document has no metadata: " + this.resource);
                return Optional.empty();
            }

        } finally {
            await this.phzReader.close();
        }

    }

    public async close() {
        await this.phzReader.close();
    }

    private getResourceEntry(url: string): ResourceEntry | undefined {

        const result = this.getResourceEntry0(url);

        if (result) {
            return result;
        }

        return this.getResourceEntry0(URLs.absolute(url, this.metadata!.url));

    }

    private getResourceEntry0(url: string): ResourceEntry | undefined {

        const resources: Array<ResourceEntry | undefined>
            = Object.values(this.resources.entries);

        return resources
            .filter(current => current && current.resource.url === url)
            .reduce(Reducers.FIRST, undefined);

    }

    private async loadDocument(url: string,
                               resources: Resources) {

        const primaryResourceEntry = this.getResourceEntry(url);

        if (primaryResourceEntry) {

            const iframe = <HTMLIFrameElement> document.getElementById('content');
            await this.loadResource(primaryResourceEntry, iframe);

            await Promise.all(this.linkPromises);

        } else {
            log.warn("No primary resource found for: " + url);
        }

    }
    public static async create(resource: PathStr | URLStr) {

        const toPHZReader = async () => {

            const phzReader = new PHZReader();

            if (URLs.isURL(resource)) {

                const response = await fetch(resource);
                const blob = await response.blob();

                await phzReader.init(blob);

            } else {
                // this is a path string.
                await phzReader.init(resource);
            }

            return phzReader;

        };

        const phzReader = await toPHZReader();
        const metadata = await phzReader.getMetadata();
        const resources = await phzReader.getResources();

        return new DirectPHZLoader(resource, phzReader, resources, metadata);

    }

    private async loadResource(resourceEntry: ResourceEntry,
                               iframe: HTMLIFrameElement) {

        const blob = await this.phzReader.getResourceAsBlob(resourceEntry);

        // now that we have the blob, which should be HTML , parse it into
        // its own document object.

        const str = await Blobs.toText(blob);

        const doc = new DOMParser().parseFromString(str, 'text/html');

        // TODO: This might be the bug regarding the page not resizing because
        // we're loading an EXTERNAL resources not a local so I don't think
        // we're getting an event that it was loaded.

        const newLinkStylesheetPromises = this.createLinkStylesheetPromises(doc);

        this.linkPromises.push(...newLinkStylesheetPromises);

        const iframes = this.neutralizeIFrames(doc);

        DOM.removeChildNodes(iframe.contentDocument!.documentElement!);

        DOM.appendChildNodes(doc.documentElement!, iframe.contentDocument!.documentElement!);

        await this.loadIFrames(iframes);

    }

    private createLinkStylesheetPromises(doc: Document): ReadonlyArray<LinkPromise> {

        const promises: LinkPromise[] = [];

        doc.querySelectorAll("link[rel=stylesheet]").forEach((link) => {

            const latch = new Latch<boolean>();
            promises.push(latch.get());

            link.addEventListener("load", () => {
                latch.resolve(true);
            });

            link.addEventListener("error", () => {
                // we're just waiting for them to be completed not their actual
                // status.
                latch.resolve(true);
            });

        });

        return promises;

    }

    private async loadIFrames(iframeRefs: IFrameRef[]) {

        for (const iframeRef of iframeRefs) {

            const resourceEntry = this.getResourceEntry(iframeRef.src);

            if (resourceEntry) {

                await this.loadResource(resourceEntry, iframeRef.iframe);

            } else {
                log.warn("No resource entry for URL: " + iframeRef.src);
            }

        }

    }

    /**
     * Go through all the iframes in this doc and fix them so that they don't
     * load as we are going to load them manually.
     */
    private neutralizeIFrames(doc: Document) {

        const result: IFrameRef[] = [];

        const iframes = Array.from(doc.querySelectorAll("iframe"));
        for (const iframe of iframes) {

            const src = iframe.getAttribute("src");

            if (src) {

                iframe.setAttribute("data-loader-src", src);
                iframe.removeAttribute("src");

                result.push({iframe, src});

            } else {
                // this iframe isn't interesting to us as it does not have
                // a src attribute that we should be using.
            }

        }

        return result;

    }


}

export type LinkPromise = Promise<boolean>;

interface IFrameRef {
    readonly src: string;
    readonly iframe: HTMLIFrameElement;
}

