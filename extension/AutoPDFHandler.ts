import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebNavigationParentedCallbackDetails = chrome.webNavigation.WebNavigationParentedCallbackDetails;
import BlockingResponse = chrome.webRequest.BlockingResponse;
import {RequestIndex} from './RequestIndex';

const HOST = 'app.getpolarized.io';

// We can't use multiple origins with this type of request so we have to
// see which URL we're redirecting to but in practice I think our main app URL
// is fine.
const ALLOWED_ORIGINS = `https://${HOST}`;
// tslint:disable-next-line:max-line-length
const EXPOSED_HEADERS = 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type, Date, Range, Server, Transfer-Encoding, X-GUploader-UploadID, X-Google-Trace';


const ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers';

const ENABLE_VIEWER_FILE_URLS = false;

// TODO: only do this on AuthPDFHandler start.
const requestIndex = new RequestIndex();
requestIndex.start();

const desktopAppPinger = new DesktopAppPinger();
desktopAppPinger.start();

export class AutoPDFHandler {

    public start() {

        chrome.webRequest.onHeadersReceived.addListener(details => {

            if (details.method !== 'GET') {
                // Don't intercept POST requests until http://crbug.com/104058 is fixed.
                return;
            }

            if (!isPDF(details)) {
                return;
            }

            if (isDownloadable(details)) {
                // Force download by ensuring that Content-Disposition: attachment is set
                return HttpHeaders.createContentDispositionAttachmentHeaders(details);
            }

            const viewerUrl = getViewerURL(details.url);

            // TODO: implement this in the future.
            // saveReferer(details);

            return { redirectUrl: viewerUrl, };
        },
        {
            urls: [
                '<all_urls>'
            ],
            types: ['main_frame', 'sub_frame'],
        },
        ['blocking', 'responseHeaders']);

        chrome.webRequest.onHeadersReceived.addListener(details => {

                let responseHeaders = details.responseHeaders || [];

                if (isPDF(details)) {

                    // Lookup the origin here so that we only do this on
                    // app.getpolarized.io origins to prevent breaking other webapps and
                    // extensions.

                    if (isCorrectInitiator(details)) {

                        const removeHeader = (header: string) => {

                            return responseHeaders
                                .filter(current => current.name.toLowerCase() !== header.toLowerCase());

                        };

                        // We have to remove existing CORS headers and replace them with
                        // our own or else we get two headers which isn't what we want.
                        // We only care about our header.

                        responseHeaders = removeHeader(ACCESS_CONTROL_ALLOW_ORIGIN);
                        responseHeaders = removeHeader(ACCESS_CONTROL_EXPOSE_HEADERS);

                        responseHeaders.push({name: ACCESS_CONTROL_ALLOW_ORIGIN, value: ALLOWED_ORIGINS});
                        responseHeaders.push({name: ACCESS_CONTROL_EXPOSE_HEADERS, value: EXPOSED_HEADERS});

                    } else {
                        console.debug("Skipping headers: incorrect initiator: " + details.url);
                    }

                } else {
                    console.debug("Skipping headers: not a PDF"  + details.url);
                }

                return {responseHeaders};

            },
            {
                urls: [
                    '<all_urls>'
                ]
            },
            ['blocking', 'responseHeaders']);

        if (ENABLE_VIEWER_FILE_URLS) {

            chrome.webRequest.onBeforeRequest.addListener(async (details): Promise<BlockingResponse | undefined> => {

                if (isDownloadable(details)) {
                    return;
                }

                // TODO: this has a bug where we can't determine how to open the file
                // URL properly because it can't use a CORS request with fetch for
                // some reason.

                const response = await fetch(details.url, {mode: 'no-cors'});
                const blob = await response.blob();

                const url = URL.createObjectURL(blob);
                const viewerUrl = getViewerURL(url);

                return { redirectUrl: viewerUrl, };
              },
              {
                urls: [
                  'file://*/*.pdf',
                  'file://*/*.PDF',
                  // 'ftp://*/*.pdf',
                  // 'ftp://*/*.PDF',
                ],
                types: ['main_frame', 'sub_frame'],
              },
              ['blocking']);

        }

        chrome.extension.isAllowedFileSchemeAccess((isAllowedAccess) => {

            if (isAllowedAccess) {
                return;
            }

            chrome.webNavigation.onBeforeNavigate.addListener(details => {

                if (details.frameId === 0 && ! isDownloadable(details)) {
                    chrome.tabs.update(details.tabId, {
                        url: getViewerURL(details.url),
                    });
                }
            }, {
                url: [{
                    urlPrefix: 'file://',
                    pathSuffix: '.pdf',
                }, {
                    urlPrefix: 'file://',
                    pathSuffix: '.PDF',
                }],
            });

        });
   }
}


function isCorrectInitiator(details: chrome.webRequest.WebResponseHeadersDetails) {

    const request = requestIndex.getRequest(details.requestId);

    if (request) {

        if (details.initiator) {
            return details.initiator.endsWith(".getpolarized.io");
        } else {
            console.warn("No initiator found for request ID: " + details.requestId);
        }

    } else {
        console.warn("No request found for request ID: " + details.requestId);
    }

    return false;


}


function hasCorrectOrigin(details: chrome.webRequest.WebResponseHeadersDetails) {

    const request = requestIndex.getRequest(details.requestId);

    if (request) {

        const requestHeaders = request.requestHeaders || [];

        console.debug(`Initiator ${request.initiator} tabId: ${request.tabId}`);

        console.debug("Working with requests headers for URL " + details.url, requestHeaders);

        const filtered =
            requestHeaders.filter(current => current.name.toLowerCase() === 'origin');

        if (filtered.length >= 1) {

            const origin  = filtered[0].value;

            if (origin) {

                console.debug("origin is: " + origin);

                return origin.endsWith(".getpolarized.io");

            } else {
                console.debug("no origin header value");
            }

        } else {
            console.debug("no origin header");
        }

    } else {
        console.warn("No request found for request ID: " + details.requestId);
    }

    return false;

}

function getViewerURL(pdfURL: string) {

    if (pdfURL.startsWith("http://")) {
        // must use our CORS proxy which is HTTPS to view this to prevent
        // mixed content errors.
        pdfURL = CORSProxy.createProxyURL(pdfURL);
    }

    const desktopAppState = desktopAppPinger.getState();

    return `https://${HOST}/pdfviewer/web/index.html?file=` +
        encodeURIComponent(pdfURL) +
        `&utm_source=pdf_link&utm_medium=chrome_extension&preview=true&from=extension&zoom=page-width&desktop-app=${desktopAppState}`;

}

/**
 * Return true if we can download the PDF by looking at the content disposition
 * headers, the URL, etc.
 *
 */
function isDownloadable(details: WebResponseHeadersDetails | WebNavigationParentedCallbackDetails | WebRequestBodyDetails) {

    if (details.url.includes('pdfjs.action=download') ||
        details.url.includes('polar.action=download')) {

        // allow a deep link to a URL and the site to override Polar if necessary
        // and also yield to the existing pdfjs.action download.

        return true;

    }

    if ((<any> details).type) {

        details = <WebResponseHeadersDetails> details;

        // Display the PDF viewer regardless of the Content-Disposition header if the
        // file is displayed in the main frame, since most often users want to view
        // a PDF, and servers are often misconfigured.
        // If the query string contains "=download", do not unconditionally force the
        // viewer to open the PDF, but first check whether the Content-Disposition
        // header specifies an attachment. This allows sites like Google Drive to
        // operate correctly (#6106).
        if (details.type === 'main_frame' && !details.url.includes('=download')) {
            return false;
        }

        const contentDisposition = (details.responseHeaders &&
            HttpHeaders.hdr(details.responseHeaders, 'content-disposition'))
        ;

        return (contentDisposition && contentDisposition.value && /^attachment/i.test(contentDisposition.value));
    }

    return false;

}

/**
 * Return true if this is a PDF file.
 */
function isPDF(details: chrome.webRequest.WebResponseHeadersDetails) {

    const contentTypeHeader = HttpHeaders.hdr(details.responseHeaders, 'content-type');

    if (contentTypeHeader && contentTypeHeader.value) {

        const headerValue = contentTypeHeader.value.toLowerCase().split(';', 1)[0].trim();

        if (headerValue === 'application/pdf') {
            return true;
        }

        if (headerValue === 'application/octet-stream') {

            if (details.url.toLowerCase().indexOf('.pdf') > 0) {
                return true;
            }

            const contentDisposition =
                HttpHeaders.hdr(details.responseHeaders, 'content-disposition');

            if (contentDisposition &&
                contentDisposition.value &&
                /\.pdf(["']|$)/i.test(contentDisposition.value)) {

                return true;

            }

        }

    }

    return false;

}


class CORSProxy {

    /**
     * Create a proxy URL which adds CORS headers to allow us to download it
     * from within the Polar webapp.
     *
     * @param targetURL
     */
    public static createProxyURL(targetURL: string) {

        // TODO: is it possible to make this use the CDN so we have one in
        // every datacenter?

        return "https://us-central1-polar-cors.cloudfunctions.net/cors?url=" + encodeURIComponent(targetURL);

    }

}
