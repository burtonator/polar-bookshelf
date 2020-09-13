import * as React from "react";

/**
 * Used with dialogs (and other areas where we have to block keyboard events
 * from propagating)
 */
export function useInputBlockListeners() {

    const handler = React.useCallback((event: React.KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }, []);

    return {
        onKeyPress: handler,
        onKeyDown: handler,
        onKeyUp: handler
    }

}
