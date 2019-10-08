
export interface ReadableKeyValueStore {

    get(key: string): string | undefined;

}

export interface WritableKeyValueStore {

    set(key: string, value: string): void;

}

/**
 * Basic key/value store interface for using with Storage, LocalStorage,
 * SessionStorage or our own backends.
 */
export interface KeyValueStore extends ReadableKeyValueStore, WritableKeyValueStore {


}

/**
 * Used with LocalStorage and SessionStorage.
 */
export class StorageKeyValueStore implements KeyValueStore {

    constructor(private readonly storage: Storage) {

    }

    public get(key: string): string | undefined {

        const value = this.storage.getItem(key);

        if (value !== null) {
            return value;
        }

        return undefined;

    }

    public set(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

}

export class LocalStorageKeyValueStore extends StorageKeyValueStore {

    constructor() {
        super(window.localStorage);
    }
}

export class SessionStorageKeyValueStore extends StorageKeyValueStore {

    constructor() {
        super(window.sessionStorage);
    }
}
