/**
 * Calls an event handler when the page has been redrawn so that we can
 * attach annotations, pagemarks, etc.
 *
 * @deprecated Use the new {ContainerLifecycleListener} instead.
 * @type {PageRedrawHandler}
 */
export class PageRedrawHandler {

    private pageElement: HTMLElement;

    private listener: any;

    constructor(pageElement: HTMLElement) {

        this.pageElement = pageElement;
        this.listener = null;

    }

    register(callback: (pageElement: HTMLElement) => void) {

        this.listener = (event: any) => {

            if (event.target && event.target.className === "endOfContent") {
                callback(this.pageElement);
            }

        };

        this.pageElement.addEventListener('DOMNodeInserted', this.listener, false);

    };

    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
    }

}
