import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebNavigationParentedCallbackDetails = chrome.webNavigation.WebNavigationParentedCallbackDetails;

class HttpHeaders {

    /**
     * Get an individual header.
     */
    public static hdr(headers: chrome.webRequest.HttpHeader[] | undefined,
                      headerName: string): chrome.webRequest.HttpHeader | undefined {

        if (! headers) {
            return undefined;
        }

        for (const header of headers) {

            if (header.name && header.name.toLowerCase() === headerName) {
                return header;
            }

        }

        return undefined;

    }

    /**
     * Takes a set of headers, and set "Content-Disposition: attachment".
     * @param {Object} details First argument of the
     *     webRequest.onHeadersReceived event. The property "responseHeaders"
     *     is read and modified if needed.
     *
     * @return {Object|undefined} The return value for the onHeadersReceived
     *     event. Object with key "responseHeaders" if the headers have been
     *     modified, undefined otherwise.
     */
    public static createContentDispositionAttachmentHeaders(details: WebResponseHeadersDetails): any | undefined {

        const headers = details.responseHeaders;

        if (headers) {

            let cdHeader = this.hdr(headers, 'content-disposition');

            if (!cdHeader) {
                cdHeader = { name: 'Content-Disposition', };
                headers.push(cdHeader);
            }

            if (cdHeader && cdHeader.value && !/^attachment/i.test(cdHeader.value)) {
                cdHeader.value = 'attachment' + cdHeader.value.replace(/^[^;]+/i, '');
                return { responseHeaders: headers};
            }

        }

    }

}
