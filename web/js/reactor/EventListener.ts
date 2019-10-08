export type EventListener<V> = (value: V) => void;

export interface RegisteredEventListener<V> extends Releaseable {

    eventListener: EventListener<V>;

    /**
     * Remove the listener after it's been registered..
     */
    release(): void;

}

export interface Releaseable {
    release(): void;
}

/**
 * A basic function that can be released.
 */
export type ReleaseFunction = () => void;

/**
 * Register and release multiple Releaseables.
 */
export class Releaser implements Releaseable {

    private releaseables: Releaseable[] = [];

    public released: boolean = false;

    public register(releaseable: Releaseable | ReleaseFunction) {

        if (typeof releaseable === 'function') {

            const delegate = releaseable;

            releaseable = {
                release(): void {
                    delegate();
                }
            };

        }

        this.releaseables.push(releaseable);
    }

    public release() {

        for (const releaseable of this.releaseables) {
            releaseable.release();
        }

        this.released = true;

    }

}
