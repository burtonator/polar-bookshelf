import {BrowserWindow} from 'electron';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

export class BrowserWindowMeta {

    /**
     * Set of tags associated with this window.
     */
    public tags: TagMap = {};

}

/**
 * Get a list of IDs for live windows.
 */
export interface LiveWindowsProvider {

    getLiveWindowIDs(): ID[];

}

export class DefaultLiveWindowsProvider implements LiveWindowsProvider {

    public getLiveWindowIDs(): ID[] {
        return BrowserWindow.getAllWindows().map(current => current.id);
    }

}

/**
 * the ID if a window.
 */
export type ID = number;

/**
 * Maintains a registry of BrowserWindows (by ID) and metadata.  GC is performed
 * each time you access the metadata since windows can come and go.
 */
export class BrowserWindowRegistry {

    // note that internally Typescript maps the numbers to strings but this
    // really breaks the APIs for dealing with Keys so we're just going to
    // give up and use a string for now.
    private static registry: {[id: string]: BrowserWindowMeta} = {};

    private static liveWindowsProvider: LiveWindowsProvider = new DefaultLiveWindowsProvider();

    /**
     * Get the metadata for a specific BrowserWindow by id.  You can access this
     * by BrowserWindow.id
     *
     * @param id
     */
    public static get(id: ID): BrowserWindowMeta | undefined {
        this.gc();
        return this.registry[`${id}`];
    }

    public static tag(id: ID, tags: TagMap) {
        this.gc();

        if (! (id in this.registry)) {
            this.registry[`${id}`] = new BrowserWindowMeta();
        }

        const meta = this.registry[`${id}`];

        Dictionaries.forDict(tags, (name, value) => {
            meta.tags[name] = value;
        });

    }

    /**
     * Find a window ID with the given tag.
     */
    public static tagged(tag: BrowserWindowTag): ID[] {
        this.gc();

        const result: ID[] = [];

        Dictionaries.forDict(this.registry, (id, meta) => {

            if (meta.tags[tag.name] === tag.value) {
                result.push(parseInt(id));
            }

        });

        return result;

    }

    /**
     * Get a copy of the current registry.
     */
    public static dump(): Readonly<{[id: string]: BrowserWindowMeta}> {
        return Object.freeze(Object.assign({}, this.registry));
    }

    public static gc() {

        const registryKeys = Object.keys(this.registry);
        const liveWindowIDs
            = this.liveWindowsProvider.getLiveWindowIDs().map(current => current.toString())

        const allWindowIDs = SetArrays.union(registryKeys, liveWindowIDs);

        const keysToRemove = SetArrays.difference(allWindowIDs, liveWindowIDs);

        keysToRemove.forEach(current => delete this.registry[current]);

        return keysToRemove.map(current => parseInt(current));

    }

}

// noinspection TsLint
export type TagMap = {[name: string]: string};

export interface BrowserWindowTag {
    name: string;
    value: string;
}




