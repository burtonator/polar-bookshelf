/**
 * @RendererContext
 */
import {Dict} from '../../util/Dict';
import {Result} from '../../util/Result';
import {Captured, CapturedDoc, DocTypeFormat, Overflow, ScrollBox} from './Captured';
import {Results} from '../../util/Results';
import {AdBlocker} from './AdBlocker';

export class ContentCapture {

    public static execute(): Result<any> {
        return Results.execute(() => ContentCapture.captureHTML());
    }


    // FIXME: <script> within SVG also needs to be stripped!

    // TODO: support strategy: article to pull out the <article> element from
    // the main document when one exists.

    /**
     * Capture the page as HTML so that we can render it static.
     *
     * @param [contentDoc] The document to capture the HTML from. We default to
     * the global 'document' object. when not given.
     *
     * @param [url] The URL of the given document.  We default to
     * contentDoc.location.href when not provided.
     *
     * @param [result] The result we are building.
     *
     */
    public static captureHTML(contentDoc?: Document,
                              url?: string,
                              result?: Captured): Captured {

        const ENABLE_IFRAMES = true;

        if (!contentDoc) {
            // this is the first document were working with.
            contentDoc = document;
        }

        if (!url) {
            url = contentDoc.location!.href;
        }

        if (!result) {

            const scrollBox = this.computeScrollBox(contentDoc);

            result = {

                /**
                 * The captured documents indexed by URL
                 */
                capturedDocuments: {},

                type: "phz",

                version: "4.0.0",

                title: contentDoc.title,

                url: contentDoc.location!.href,

                // keep track of the scroll height and width of the document.
                // when the document is able to be adjusted to the size of the
                // window then we're able to display it within the HTML viewer.
                scroll: scrollBox,
                scrollBox

            };

        }

        if (url in result.capturedDocuments) {
            console.warn("Skipping URL.  Already indexed: " + url);
            return result;
        }

        // this has to be done BEFORE we clone because there is no mapping from
        // the stylesheet to the element after we clone it.
        this.inlineStyles(contentDoc);

        const cloneDoc: Document = <Document> contentDoc.cloneNode(true);

        result.capturedDocuments[url]
            = ContentCapture.captureDoc(cloneDoc, contentDoc.location!.href);

        if (ENABLE_IFRAMES) {

            console.log("Exporting iframes...");

            // now recurse into all the iframes in this doc and capture their
            // HTML too.
            const iframes = contentDoc.querySelectorAll("iframe");

            console.log("Found N iframes: " + iframes.length);

            let nrHandled = 0;
            let nrSkipped = 0;

            for (const iframe of Array.from(iframes)) {

                const frameValidity = ContentCapture.computeFrameValidity(iframe);

                if (frameValidity.valid && iframe.contentDocument) {

                    const iframeHref = iframe.contentDocument.location!.href;

                    console.log("Going to capture iframe: " + iframeHref);
                    console.log(iframe.outerHTML);
                    ContentCapture.captureHTML(iframe.contentDocument, iframeHref, result);

                    ++nrHandled;

                } else {
                    console.log(`Skipping iframe: ` + iframe.src, frameValidity, iframe.outerHTML);
                    ++nrSkipped;
                }

            }

            console.log(`Handled ${nrHandled} and skipped ${nrSkipped} iframes`);

        }

        return result;

    }

    /**
     * Return true if we should handle the given iframe.
     */
    private static computeFrameValidity(iframe: HTMLIFrameElement) {

        const result: any = {
            reason: null,
            valid: true
        };

        if (! iframe.contentDocument) {
            console.log("iframe not valid due to no contentDocument");

            return {reason: "NO_CONTENT_DOCUMENT", valid: false};
        }

        // TODO: only work with http and https URLs or about:blank

        if (iframe.style.display === "none") {

            console.log("iframe not valid due to display:none");

            // TODO: we need a more practical mechanism to determine if we
            // are display none including visibility and calculated CSS and
            // off screen placement (top: -1000px, left: -1000px)

            return {reason: "DISPLAY_NONE", valid: false};
        }

        return result;

    }

    private static captureDoc(cloneDoc: Document, url: string): CapturedDoc {

        if (!cloneDoc) {
            throw new Error("No cloneDoc");
        }

        // TODO: include a fingerprint in the output JSON which should probably
        // be based on the URL.

        // TODO: store many of these fields in the HTML too because the iframes
        // need to have the same data

        const scrollBox = this.computeScrollBox(cloneDoc);

        const docTypeFormat = this.docTypeFormat(cloneDoc);

        const result: CapturedDoc = {

            // TODO: capture HTML metadata including twitter card information
            // which we could show in the UI.  Since we are capturing the whole
            // HTML though we could do this at any time in the future.

            title: cloneDoc.title,

            // The document href / location as loaded.
            href: url,
            url,

            // The scroll height of the document as it is currently rendered.
            // This is used as a hint for loading the static form of the
            // document.
            scrollHeight: scrollBox.height,

            scrollBox,

            // The content as an HTML string
            content: "",

            /**
             * The length of the content in number of characters.  This is NOT
             * the content length which would be the number of bytes.
             */
            contentTextLength: 0,

            docTypeFormat,

            contentType: (<any> cloneDoc).contentType,

            mutations: {
                eventAttributesRemoved: 0,
                existingBaseRemoved: false,
                baseAdded: false,
                javascriptAnchorsRemoved: 0,
                cleanupRemoveScripts: null,
                cleanupHead: null,
                cleanupBase: null,
                showAriaHidden: 0,
            }

        };

        console.log("Doc type format is: " + docTypeFormat);

        if (docTypeFormat === 'html') {

            // TODO: make the mutations a list of functions that need to be run
            // and the mutation names just the list of the functions. The
            // functions can then just return a mutation and the data
            // structures are updated.

            result.mutations.cleanupRemoveScripts = ContentCapture.cleanupRemoveScripts(cloneDoc, url);
            ContentCapture.removeNoScriptElements(cloneDoc);
            result.mutations.cleanupHead = ContentCapture.cleanupHead(cloneDoc, url);
            result.mutations.cleanupBase = ContentCapture.cleanupBase(cloneDoc, url);
            result.mutations.adsBlocked = AdBlocker.cleanse(cloneDoc, url);

            // ***  add metadata into the HTML for polar

            document.head!.appendChild(ContentCapture.createMeta("polar-url", result.url));

            // *** remove javascript html onX elements.

            const EVENT_ATTRIBUTES = ContentCapture.createEventAttributes();

            cloneDoc.querySelectorAll("*").forEach((element) => {

                Array.from(element.attributes).forEach((attr) => {
                    if (EVENT_ATTRIBUTES[attr.name]) {
                        element.removeAttribute(attr.name);
                        ++result.mutations.eventAttributesRemoved;
                    }
                });

            });

            // *** remove javascript: anchors.

            cloneDoc.querySelectorAll("a").forEach((element) => {

                const href = element.getAttribute("href");
                if (href && href.indexOf("javascript:") === 0) {
                    element.removeAttribute("href");
                    ++result.mutations.javascriptAnchorsRemoved;
                }

            });

            result.mutations.showAriaHidden = ContentCapture.cleanupShowAriaHidden(cloneDoc);

        }

        result.content = ContentCapture.toOuterHTML(cloneDoc, docTypeFormat);
        result.contentTextLength = result.content.length;

        console.log(`Captured ${url} which has a text length of: ${result.content.length}`);

        return result;

    }

    /**
     * Return the document format of the underlying document by determining if
     * it's XML or HTML
     */
    private static docTypeFormat(doc: Document): DocTypeFormat {

        if (doc.doctype === null || doc.doctype === undefined) {
            return 'html';
        }

        if (doc.doctype.name === null || doc.doctype.name === undefined) {
            return 'html';
        }

        return doc.doctype.name.toLowerCase() === 'html' ? 'html' : 'xml';

    }

    private static computeScrollBox(doc: Document): ScrollBox {

        if (! doc.documentElement) {
            throw new Error("No document element");
        }

        const computedStyle = window.getComputedStyle(doc.documentElement!);

        return {
            width: doc.documentElement!.scrollWidth,
            widthOverflow: <Overflow> computedStyle.overflowX || 'visible' ,
            height: doc.documentElement!.scrollHeight,
            heightOverflow: <Overflow> computedStyle.overflowY || 'visible' ,
        };

    }

    private static cleanupBase(cloneDoc: Document, url: string) {

        const result: any = {
            existingBaseRemoved: false,
            baseAdded: false
        };

        let base = cloneDoc.querySelector("base");

        if (base && base.parentElement) {
            // remove the current 'base' if one exists...
            base.parentElement.removeChild(base);
            result.existingBaseRemoved = true;
        }

        // *** create a NEW base element for this HTML

        base = cloneDoc.createElement("base");
        base.setAttribute("href", url);

        if (cloneDoc.head!.firstChild != null) {
            // base must be the first element
            cloneDoc.head!.insertBefore(base, cloneDoc.head!.firstChild);
        } else {
            cloneDoc.head!.appendChild(base);
        }

        result.baseAdded = true;

        return result;

    }

    private static cleanupHead(cloneDoc: Document, url: string): any {

        // make sure the document has a head.

        const result = {
            headAdded: false
        };

        if (! cloneDoc.head) {
            cloneDoc.insertBefore(cloneDoc.createElement("head"), cloneDoc.firstElementChild);
            result.headAdded = true;
        }

        return result;

    }

    private static inlineStyles(doc: Document): any {

        const result = {
            inlined: 0
        };

        function toSerializedStylesheet(styleSheet: CSSStyleSheet): string {

            let buff = "";

            const imports: CSSStyleSheet[] = [];

            for (const rule of Array.from(styleSheet.rules)) {

                // buff += rule.cssText + '\n';

                buff += rule.cssText;

            }

            return buff;

        }

        for (const styleSheet of Array.from(doc.styleSheets)) {

            if (styleSheet.ownerNode instanceof HTMLElement) {

                if (styleSheet.ownerNode.tagName === 'STYLE') {

                    // the ownerNode is just going to be flat out wrong here...
                    // shoot

                    styleSheet.ownerNode.innerText = toSerializedStylesheet( <CSSStyleSheet> styleSheet);
                    ++result.inlined;
                }

            }

        }

        return result;

    }


    /**
     * noscript elements must be removed because they weren't actually used
     * as part of the original rendered page.
     */
    private static removeNoScriptElements(cloneDoc: Document) {

        const elements = Array.from(cloneDoc.documentElement.querySelectorAll('noscript'));
        for (const element of elements) {
            element.parentElement!.removeChild(element);
        }

    }


    private static cleanupRemoveScripts(cloneDoc: Document, url: string): any {

        const result = {
            scriptsRemoved: 0
        };

        // remove the script elements as these are active and we do not want
        // them loaded in the future.
        cloneDoc.querySelectorAll("script").forEach((scriptElement) => {

            if (scriptElement.parentElement) {
                scriptElement.parentElement.removeChild(scriptElement);
                ++result.scriptsRemoved;
            }

        });

        // make sure the script removal worked
        if (cloneDoc.querySelectorAll("script").length !== 0) {
            throw new Error("Unable to remove scripts");
        }

        return result;

    }

    private static cleanupShowAriaHidden(cloneDoc: Document): number {

        let mutations: number = 0;

        cloneDoc.querySelectorAll("*").forEach((element) => {
            if (element.getAttribute("aria-hidden") === "true") {
                element.setAttribute("aria-hidden", "false");
                ++mutations;
            }
        });

        return mutations;

    }

    private static cleanupFullStylesheetURLs(cloneDoc: Document): number {

        let mutations: number = 0;

        cloneDoc.querySelectorAll("a").forEach((element) => {

            const href = element.getAttribute("href");
            if (href) {
                element.setAttribute("aria-hidden", "false");
                ++mutations;
            }
        });

        return mutations;

    }

    private static doctypeToOuterHTML(doctype: DocumentType) {

        return "<!DOCTYPE "
               + doctype.name
               + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
               + (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
               + (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
               + '>';

    }

    private static processingInstructionToOuterHTML(processingInstruction: ProcessingInstruction) {
        return `<?${processingInstruction.target} ${processingInstruction.data} ?>`;
    }

    private static createMeta(name: string, content: string) {
        const meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        return meta;
    }

    /**
     * Convert the given doc to outerHTML including the DocType and other
     * information.
     *
     * We return the original doc in near original condition. No major
     * mutations.
     *
     * Note that new XMLSerializer().serializeToString(document) includes the
     * canonical form not the source form.
     *
     * @param doc
     */
    private static toOuterHTML(doc: Document, docTypeFormat: DocTypeFormat) {

        // https://stackoverflow.com/questions/817218/how-to-get-the-entire-document-html-as-a-string

        // https://stackoverflow.com/questions/6088972/get-doctype-of-an-html-as-string-with-javascript

        if (docTypeFormat === 'xml') {

            let result = '';

            for (const node of Array.from(doc.childNodes)) {

                switch (node.nodeType) {

                    case Node.DOCUMENT_TYPE_NODE:
                        result += this.doctypeToOuterHTML(<DocumentType> node);
                        result += '\n';
                        break;

                    case Node.PROCESSING_INSTRUCTION_NODE:
                        result += this.processingInstructionToOuterHTML(<ProcessingInstruction> node);
                        result += '\n';
                        break;

                    case Node.ELEMENT_NODE:
                        result += (<Element> node).outerHTML;
                        result += '\n';
                        break;

                }

            }

            return result;

        } else {

            if (doc.doctype) {

                return ContentCapture.doctypeToOuterHTML(doc.doctype) +
                    "\n" +
                    doc.documentElement!.outerHTML;

            } else {
                return doc.documentElement!.outerHTML;
            }

        }

    }

    private static createEventAttributes(): Dict<number> {

        return Object.freeze({
            "onafterprint": 1,
            "onbeforeprint": 1,
            "onbeforeunload": 1,
            "onerror": 1,
            "onhashchange": 1,
            "onload": 1,
            "onmessage": 1,
            "onoffline": 1,
            "ononline": 1,
            "onpagehide": 1,
            "onpageshow": 1,
            "onpopstate": 1,
            "onresize": 1,
            "onstorage": 1,
            "onunload": 1,
            "onblur": 1,
            "onchange": 1,
            "oncontextmenu": 1,
            "onfocus": 1,
            "oninput": 1,
            "oninvalid": 1,
            "onreset": 1,
            "onsearch": 1,
            "onselect": 1,
            "onsubmit": 1,
            "onkeydown": 1,
            "onkeypress": 1,
            "onkeyup": 1,
            "ondblclick": 1,
            "onmousedown": 1,
            "onmousemove": 1,
            "onmouseout": 1,
            "onmouseover": 1,
            "onmouseup": 1,
            "onmousewheel": 1,
            "onwheel": 1,
            "ondrag": 1,
            "ondragend": 1,
            "ondragenter": 1,
            "ondragleave": 1,
            "ondragover": 1,
            "ondragstart": 1,
            "ondrop": 1,
            "onscroll": 1,
            "oncopy": 1,
            "oncut": 1,
            "onpaste": 1,
            "onabort": 1,
            "oncanplay": 1,
            "oncanplaythrough": 1,
            "oncuechange": 1,
            "ondurationchange": 1,
            "onemptied": 1,
            "onended": 1,
            "onloadeddata": 1,
            "onloadedmetadata": 1,
            "onloadstart": 1,
            "onpause": 1,
            "onplay": 1,
            "onplaying": 1,
            "onprogress": 1,
            "onratechange": 1,
            "onseeked": 1,
            "onseeking": 1,
            "onstalled": 1,
            "onsuspend": 1,
            "ontimeupdate": 1,
            "onvolumechange": 1,
            "onwaiting": 1,
            "onshow": 1,
            "ontoggle": 1
        });
    }

}

/**
 * Generate IDs used for different internal content capture purposes
 */
export class IDGenerator {

    private static id: number = 0;

    public static generate() {
        return this.id++;
    }

}

// console.log("Content capture script loaded within: " + window.location.href);

declare var global: any;

process.once('loaded', () => {

    // TODO: importing and then defining configureBrowser did not work here.
    // It might be nice to work with postMessage here.

    // This is a workaround to make this available to the new process while
    // nodeIntegration is false.  We're going to need some way to handle this
    // in the future
    console.log("Re-defining ContentCapture");
    global.ContentCapture = ContentCapture;
});

