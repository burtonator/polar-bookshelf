import {Optional} from "polar-shared/src/util/ts/Optional";
import {DurationStr} from 'polar-shared/src/util/TimeDurations';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';

export abstract class Prefs {

    // TODO: migrate to using KeyValueStore

    /**
     * A marked pref is a pref that is boolean true or false
     */
    public mark(key: string, value: boolean = true): void {

        if (value) {
            this.set(key, 'true');
        } else {
            this.set(key, 'false');
        }

    }

    public toggleMarked(key: string, value: boolean = false) {
        this.mark(key, ! this.isMarked(key, value));
    }

    public isMarked(key: string, defaultValue: boolean = false) {

        const currentValue =
            this.get(key).getOrElse(`${defaultValue}`);

        return currentValue === 'true';

    }

    public markDelayed(key: string, duration: DurationStr = "1w") {

        const durationMS = TimeDurations.toMillis(duration);
        const after = Date.now() + durationMS;
        this.set(key, `${after}`);

    }

    public isMarkedDelayed(key: string): boolean {

        const val = this.get(key).getOrElse('');

        if (val.match(/[0-9]+/)) {
            return Date.now() < parseInt(val);
        }

        return false;

    }

    /**
     * Return true if the given pref is defined.
     */
    public defined(key: string) {
        return this.get(key).isPresent();
    }

    /**
     * Get a current pref value.
     */
    public abstract get(key: string): Optional<string>;

    /**
     * Set a current pref value.
     */
    public abstract set(key: string, value: string): void;

}

/**
 * Prefs object just backed by a local dictionary.
 */
export class DictionaryPrefs extends Prefs {

    public delegate: StringToStringDict = {};

    constructor(delegate: StringToStringDict = {}) {
        super();
        this.delegate = delegate;
    }

    public get(key: string): Optional<string> {
        return Optional.of(this.delegate[key]);
    }

    public set(key: string, value: string): void {
        this.delegate[key] = value;
    }

    public toDict(): StringToStringDict {
        return {...this.delegate};
    }

}

/**
 * Designed to be used in browsers.
 */
export class LocalStoragePrefs extends Prefs {

    public get(key: string): Optional<string> {
        return Optional.of(window.localStorage.getItem(key));
    }

    public set(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

}

export interface StringToStringDict {
    [key: string]: string;
}
