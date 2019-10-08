/**
 * A Nullable type that can be mutates / set.  There are still patterns where
 * null types may be valuable without constantly checking them.
 */
export class Nullable<T> {

    private value?: T = undefined;

    public get(): T {

        if(this.value === undefined || this.value == null) {
            throw new Error("Value is undefined");
        }

        return this.value;

    }

    public getOrElse(value: T): T {

        if (this.value !== undefined && this.value !== null) {
            return this.value;
        }

        return value;

    }

    public isPresent(): boolean {
        return this.value !== undefined && this.value !== null;
    }

    public set(value: T): void {
        this.value = value;
    }

}
