
/**
 * Create a visual identifier on page of the current mouse position from the
 * page events.  We also inject ourselves in child iframes.
 */
export class MouseTracer {

    private readonly doc: HTMLDocument;

    /**
     * @param doc {Document} The document to work with.
     */
    constructor(doc: HTMLDocument) {
        this.doc = doc;
    }

    public start() {

        MouseTracer.startWithinDoc(this.doc);

        this.doc.querySelectorAll("iframe").forEach(iframe => {

            if (! MouseTracer.startWithinIFrame(iframe)) {

                iframe.addEventListener("load", () => {
                    MouseTracer.startWithinIFrame(iframe);
                });

                MouseTracer.startWithinIFrame(iframe);
            }

        });

    }

    private static startWithinIFrame(iframe: HTMLIFrameElement): boolean {

        if (iframe.contentDocument) {
            MouseTracer.startWithinDoc(iframe.contentDocument);
            return true;
        }

        return false;

    }

    private static startWithinDoc(doc: HTMLDocument) {

        doc.addEventListener("mousemove", mouseEvent => {

            const tracerElement = MouseTracer.getOrCreateTracerElement(doc);

            // console.log("Got mouseEvent: ", mouseEvent);

            tracerElement.textContent = MouseTracer.format(mouseEvent);

        });

        doc.addEventListener("mouseout", mouseEvent => {

            const tracerElement = MouseTracer.getOrCreateTracerElement(doc);

            const last = tracerElement.textContent;

            tracerElement.textContent = `OUT: ${last}`;

        });

        doc.addEventListener("click", mouseEvent => {

            console.log(`Got mouseEvent at ${doc.location!.href}: `, mouseEvent);

        });

    }

    private static format(mouseEvent: MouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }

    /**
     *
     * @return {HTMLDivElement}
     */
    private static getOrCreateTracerElement(doc: HTMLDocument) {

        const id = "tracer-element";

        if (doc.getElementById(id)) {
            return doc.getElementById(id)!;
        }

        const div = doc.createElement("div");

        div.style.cssText = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 999999; font-size: 12px; min-width: 18em; min-height: 1em;";
        div.textContent = ' ';
        div.setAttribute("id", id);

        doc.body.appendChild(div);

        return div;

    }

}
