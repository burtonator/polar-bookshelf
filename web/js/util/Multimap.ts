export interface Multimap<K, V> {
    clear(): void;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    containsEntry(key: K, value: V): boolean;
    delete(key: K, value?: V): boolean;
    entries: ReadonlyArray<MultimapEntry<K, V>>;
    get(key: K): V[];
    keys(): ReadonlyArray<K>;
    put(key: K, value: V): ReadonlyArray<MultimapEntry<K, V>>;
}

export class ArrayListMultimap<K, V> implements Multimap<K, V> {

    private backing: Array<MultimapEntry<K, V>> = [];

    public clear(): void {
        this.backing = [];
    }

    public containsKey(key: K): boolean {
        return this.backing
            .filter(entry => entry.key === key)
            .length > 0;
    }

    public containsValue(value: V): boolean {
        return this.backing
            .filter(entry => entry.value === value)
            .length > 0;
    }

    public containsEntry(key: K, value: V): boolean {
        return this.backing
            .filter(entry => entry.key === key && entry.value === value)
            .length > 0;
    }

    public delete(key: K, value?: V): boolean {
        const temp = this.backing;
        this.backing = this.backing
            .filter(entry => {

                if (value) {
                    return entry.key !== key || entry.value !== value;
                }
                return entry.key !== key;
            });

        return temp.length !== this.backing.length;

    }

    public get entries(): ReadonlyArray<MultimapEntry<K, V>> {
        return this.backing;
    }

    public get(key: K): V[] {
        return this.backing
            .filter(entry => entry.key === key)
            .map(entry => entry.value);
    }

    public keys(): ReadonlyArray<K> {
        return Array.from(new Set(this.backing.map(entry => entry.key)));
    }

    public put(key: K, value: V): Array<MultimapEntry<K, V>> {
        this.backing.push(new MultimapEntry(key, value));
        return this.backing;
    }
}

class MultimapEntry<K, V> {
    constructor(readonly key: K, readonly value: V) {}
}
