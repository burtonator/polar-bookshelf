import {Optional} from "polar-shared/src/util/ts/Optional";

export class ConditionalSetting {

    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    /**
     * True if this matches the condition to trigger some value based on this
     * setting.  After matching it's probably best to update the value based
     * on either implicit or manual acceptance.
     * @param predicate
     */
    public accept(predicate: Predicate<string>) {
        return predicate(this.get());
    }

    public get(): Optional<string> {
        return Optional.of(window.localStorage.getItem(this.key));
    }

    public set(value: string): void {
        window.localStorage.setItem(this.key, value);
    }

}

export type Predicate<T> = (value: Optional<T>) => boolean;
