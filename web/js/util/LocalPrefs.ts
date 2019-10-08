import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DurationStr, TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {DurationMS} from 'polar-shared/src/util/TimeDurations';

/**
 * @Deprecated use the new IPrefs systems
 */
export class LocalPrefs {

    public static mark(key: string, value: boolean = true): void {

        if (value) {
            this.set(key, 'true');
        } else {
            this.set(key, 'false');
        }
    }

    public static toggle(key: string, value: boolean = false) {
        this.mark(key, ! this.isMarked(key, value));
    }

    /**
     * The initial value is false, After that the value is true.
     */
    public static markOnceRequested(key: string) {

        const result = this.isMarked(key);

        this.mark(key);

        return result;

    }

    public static async markOnceExecuted(key: string,
                                         handler: () => Promise<void>,
                                         otherwise?: () => Promise<void>): Promise<void> {

        const marked = this.isMarked(key);

        if (marked) {

            if (otherwise) {
                await otherwise();
            }

            return;
        }

        await handler();

        this.mark(key);

    }

    public static isMarked(key: string, defaultValue: boolean = false) {

        const currentValue =
            this.get(key).getOrElse(`${defaultValue}`);

        return currentValue === 'true';

    }

    public static isDelayed(key: string, duration: DurationStr) {

        const durationMS = TimeDurations.toMillis(duration);

        const pref = this.get(key).getOrUndefined();

        if (pref && pref.match(/[0-9]+/)) {

            const until = parseInt(pref, 10);
            const now = Date.now();

            if (now < until) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }

    }

    /**
     * Compute how long this item is delayed. Returns a positive number for the
     * delay or a negative number if the item delay has expired.
     */
    public static computeDelay(key: string): DurationMS | undefined {

        const pref = this.get(key).getOrUndefined();

        if (pref && pref.match(/[0-9]+/)) {

            const until = parseInt(pref, 10);
            const now = Date.now();

            return until - now;

        } else {
            return undefined;
        }

    }

    public static markDelayed(key: string, duration: DurationStr) {

        const durationMS = TimeDurations.toMillis(duration);
        const until = Date.now() + durationMS;
        this.set(key, `${until}`);

    }

    /**
     * Return true if the given pref is defined.
     */
    public static defined(key: string) {
        return this.get(key).isPresent();
    }

    public static get(key: string): Optional<string> {

        const storage = StorageBackends.get();

        return storage.get(key);
    }

    public static set(key: string, value: string | number): void {

        if (typeof value === 'number') {
            value = value.toString();
        }

        const storage = StorageBackends.get();

        storage.set(key, value);

    }

}

export class StorageBackends {

    public static delegate?: IStorageBackend;

    public static get() {

        if (this.delegate) {
            return this.delegate;
        }

        return new LocalStorageBackend();

    }

}

interface IStorageBackend {

    get(key: string): Optional<string>;

    set(key: string, value: string): void;

}

class LocalStorageBackend {

    public get(key: string): Optional<string> {
        return Optional.of(window.localStorage.getItem(key));
    }

    public set(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

}

export class MockStorageBackend {

    private backing: {[key: string]: string} = {};

    public get(key: string): Optional<string> {
        return Optional.of(this.backing[key]);
    }

    public set(key: string, value: string): void {
        this.backing[key] = value;
    }

}
