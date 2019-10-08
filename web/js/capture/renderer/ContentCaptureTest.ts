import {assert} from 'chai';
import {JSDOM} from 'jsdom';
import {ConstructorOptions} from 'jsdom';
import {ResourceLoader} from 'jsdom';
import {FetchOptions} from 'jsdom';
import {ContentCapture} from './ContentCapture';
import {assertJSON} from '../../test/Assertions';
import {isPresent} from 'polar-shared/src/Preconditions';
import waitForExpect from 'wait-for-expect';

declare var global: any;

describe('ContentCapture', function() {

    it("test basic", function() {

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM("<body><div data-foo='bar' data-cat-dog='dog' data-one-two-three-four='dog'></div></body>", opts);
        global.window = dom.window;
        global.document = dom.window.document;

        assert.ok(window);

        const result = ContentCapture.captureHTML(dom.window.document, url);

        const expected = {
            "capturedDocuments": {
                "https://www.example.com": {
                    "content": "<html><head><base href=\"https://www.example.com/\"></head><body><div data-foo=\"bar\" data-cat-dog=\"dog\" data-one-two-three-four=\"dog\"></div></body></html>",
                    "contentTextLength": 152,
                    "contentType": "text/html",
                    "docTypeFormat": "html",
                    "href": "https://www.example.com/",
                    "mutations": {
                        "adsBlocked": {
                            "amp": {
                                "elementsRemoved": 0
                            }
                        },
                        "baseAdded": false,
                        "cleanupBase": {
                            "baseAdded": true,
                            "existingBaseRemoved": false
                        },
                        "cleanupHead": {
                            "headAdded": false
                        },
                        "cleanupRemoveScripts": {
                            "scriptsRemoved": 0
                        },
                        "eventAttributesRemoved": 0,
                        "existingBaseRemoved": false,
                        "javascriptAnchorsRemoved": 0,
                        "showAriaHidden": 0
                    },
                    "scrollBox": {
                        "height": 0,
                        "heightOverflow": "visible",
                        "width": 0,
                        "widthOverflow": "visible"
                    },
                    "scrollHeight": 0,
                    "title": "",
                    "url": "https://www.example.com/"
                }
            },
            "scroll": {
                "height": 0,
                "heightOverflow": "visible",
                "width": 0,
                "widthOverflow": "visible"
            },
            "scrollBox": {
                "height": 0,
                "heightOverflow": "visible",
                "width": 0,
                "widthOverflow": "visible"
            },
            "title": "",
            "type": "phz",
            "url": "https://www.example.com/",
            "version": "4.0.0"
        };

        assertJSON(result, expected);

    });


    it("test with iframe", async function() {

        const contentMap = {
            'https://www.example.com/': "<html><body><iframe src='https://www.example.com/iframe.html'></iframe></body></html>",
            'https://www.example.com/iframe.html': "<html></html><body>this is the iframe</body></html>"
        };

        const resourceLoader = new ContentResourceLoader(contentMap);

        const url = 'https://www.example.com';

        const dom = new JSDOM("<html><body><iframe src='https://www.example.com/iframe.html'></iframe></body></html>", {url, contentType: 'text/html', resources: resourceLoader});

        global.window = dom.window;
        global.document = dom.window.document;
        global.HTMLElement = dom.window.HTMLElement;

        assert.ok(window);

        console.log("Waiting for iframe doc...");

        await waitForExpect(() => {

            const iframes = dom.window.document.querySelectorAll("iframe");
            assert.equal(iframes.length, 1);

            const iframe = iframes[0];

            assert.ok(isPresent(iframe.contentDocument));

        });

        console.log("Waiting for iframe doc...done");

        const result = ContentCapture.captureHTML(dom.window.document, url);

        assert.equal(Object.values(result.capturedDocuments).length, 2);

    });

});

class ContentResourceLoader extends ResourceLoader {

    public constructor(public readonly contentMap: ContentMap,
                       public readonly required: boolean = true) {
        super();
    }

    public fetch(url: string, options: FetchOptions): Promise<Buffer> | null {

        const content = this.contentMap[url];

        // Override the contents of this script to do something unusual.
        if (content) {
            const result = Buffer.from(content);

            (<any> result).headers = {
                'content-type': 'text/html'
            };

            return Promise.resolve(result);
        }

        if (this.required) {
            throw new Error("Resource not found but required: " + url);
        }

        return super.fetch(url, options);

    }

}

export interface ContentMap {
    [url: string]: string;
}



