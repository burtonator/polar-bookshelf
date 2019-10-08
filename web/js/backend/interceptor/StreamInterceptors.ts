import {net} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {Duplex, PassThrough, Readable, Stream} from 'stream';
import InterceptStreamProtocolRequest = Electron.InterceptStreamProtocolRequest;
import StreamProtocolResponse = Electron.StreamProtocolResponse;
import * as fs from 'fs';
import {Files} from 'polar-shared/src/util/Files';

const log = Logger.create();

export class StreamInterceptors {

    public static mockInterceptor(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {
        callback( <any> {
            statusCode: 200,
            headers: {
             'content-type': 'text/html'
            },
            data: createStream('HTTP 200 OK\r\n<h5>Response</h5>')
        });
    }

    /**
     * Call the given lambda with setTimeout so it doesn't execute in the
     * foreground.
     *
     * This is a workaround to fix an Electron lockup issue.
     *
     * @param delegate
     */
    public static withSetTimeout(delegate: () => void) {

        setTimeout(() => {
            delegate();
        }, 0);

    }

    public static handleWithNetRequest(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug("Handling request: ", request.url);

        const options = {
            method: request.method,
            url: request.url,
        };

        const responseStream = new PassThrough();

        const netRequest = net.request(options)
            .on('response', async (response) => {

                response
                    .on('data', chunk => {
                        responseStream.push(chunk);
                    })
                    .on('end', () => {
                        responseStream.push(null);
                    })
                    .on('aborted', () => {
                        log.error(`Response aborted: ${request.url}`);
                        callback(undefined); // TODO test this.
                    })
                    .on('error', () => {
                        log.error(`Response error: ${request.url}`);
                        callback(undefined); // TODO test this.
                    });

                const headers = Object.assign({}, response.headers);

                // We have to delete the content-encoding HTTP header because
                // the net.request API already performs the gzip/deflate
                // encoding FOR us and Chrome attempts to double decode it and
                // then breaks.
                delete headers['content-encoding'];

                const streamProtocolResponse: CorrectStreamProtocolResponse = {
                    headers,
                    data: responseStream,
                    statusCode: response.statusCode
                };

                callback(streamProtocolResponse);

            })
            .on('abort', () => {
                log.error(`Request abort: ${request.url}`);
                callback(undefined); // TODO test this.
            })
            .on('error', (error) => {
                log.error(`Request error: ${request.url}`, error);
                callback(undefined); // TODO test this.

            });

        for (const header of Object.keys(request.headers)) {
            log.debug("Setting request header: ", header);
            const headerValue = (<any> request.headers)[header];
            netRequest.setHeader(header, headerValue );
        };

        if (request.uploadData) {

            // We have to call netRequest.write on all the request.uploadData.

            log.debug(`Writing data to request with method ${request.method}`);

            request.uploadData.forEach(current => {

                // TODO: we need to handle `blobUUID` and `file` which is valid
                // input.

                if (current.file) {

                    Files.readFileAsync(current.file)
                        .then(buffer => netRequest.write(buffer))
                        .catch(err => log.error("Could not upload: ", err));

                } else if (current.blobUUID) {

                    // FIXME: I think we have to use the blob: URL handler to fetch
                    // this data just like we would any normal URL then write the
                    // data to the connection. which is ugly.

                    throw new Error("Do not currently handle blobs");

                } else {
                    netRequest.write(this.assertChunk(current.bytes));
                }

            });

            // throw new TypeError('First argument must be a string or Buffer.')

        }

        netRequest.end();

    }

    private static assertChunk(chunk: Buffer): Buffer {

        if (chunk === undefined) {
            // TODO: we are getting this in
            throw new TypeError('Must not be undefined.');
        }

        if (chunk === null) {
            throw new TypeError('Must not be null.');
        }

        const chunkIsString = typeof chunk === 'string';
        const chunkIsBuffer = chunk instanceof Buffer;

        if (!chunkIsString && !chunkIsBuffer) {
            log.error("Invalid data given: ", chunk);
            throw new TypeError('Must be a string or Buffer.');
        }

        return chunk;

    }

}


// noinspection TsLint
export type StreamProtocolCallback = (stream?: ReadableStream | StreamProtocolResponse | CorrectStreamProtocolResponse) => void;

export interface CorrectStreamProtocolResponse {


    // Docs: http://electron.atom.io/docs/api/structures/stream-protocol-response

    /**
     * A Node.js readable stream representing the response body
     */
    data: ReadableStream | Readable | NodeJS.ReadableStream;
    /**
     * An object containing the response headers
     */
    headers: Electron.Headers;
    /**
     * The HTTP response code
     */
    statusCode: number;

}


function createStream(text: string) {
    const rv = new PassThrough();
    rv.push(text);
    rv.push(null);
    return rv;
}
