export namespace KeyHandlers {


    export type KeyHandler = (event: KeyboardEvent | undefined) => void;

    export type KeyHandlerMap<V> = {[name: string]: KeyHandler};

    export function withDefaultBehavior<V>(callbacks: KeyHandlerMap<V>) {
        const result = {...callbacks};

        for (const key of Object.keys(result)) {
            result[key] = executedWithDefaultBehavior(result[key]);
        }

        return result;

    }

    /**
     * Builds keymaps that have default behavior including running in timeout
     * and preventing other key bindings from happening.
     */
    export function executedWithDefaultBehavior<V>(delegate: KeyHandler): KeyHandler {

        return (event: KeyboardEvent | undefined) => {

            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }

            setTimeout(() => delegate(event), 1);

        };

    }


}
