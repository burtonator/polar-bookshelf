export namespace KeyboardShortcutHandlers {

    export function withPreventDefault(delegate: () => void) {

        return (event: KeyboardEvent) => {

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            delegate();

        }

    }

}
