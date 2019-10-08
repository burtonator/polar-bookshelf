
/**
 * Keeps a mapping of ID to the original HTTP request so that we can look at
 * the headers properly.
 */
export class RequestIndex {

    private backing: {[id: string]: chrome.webRequest.WebRequestHeadersDetails} = {};

    public start() {

        const filter =  {
            urls: [
                '<all_urls>'
            ]
        };

        // these requests terminate and clean up data so we don't run out of memory.
        chrome.webRequest.onCompleted.addListener(details => this.onComplete(details), filter);

        chrome.webRequest.onErrorOccurred.addListener(details => this.onErrorOccurred(details), filter);

        // this keeps track of the headers that are being used.
        chrome.webRequest.onSendHeaders.addListener(details => this.onSendHeaders(details), filter);

    }

    public getRequest(requestId: string): chrome.webRequest.WebRequestHeadersDetails | undefined {

        const result = this.backing[requestId];

        if (result) {

            return result;
        }

        return undefined;

    }

    private onComplete(details: chrome.webRequest.WebResponseCacheDetails) {
        delete this.backing[details.requestId];
    }

    private onErrorOccurred(details: chrome.webRequest.WebResponseErrorDetails) {
        delete this.backing[details.requestId];
    }

    private onSendHeaders(details: chrome.webRequest.WebRequestHeadersDetails) {
        this.backing[details.requestId] = details;
    }
}
