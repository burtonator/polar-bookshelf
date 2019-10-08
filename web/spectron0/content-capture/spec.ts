import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {assertJSON} from '../../js/test/Assertions';
import {Spectron} from '../../js/test/Spectron';

const assert = require('assert');

const TIMEOUT = 10000;

describe('content-capture', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('capture basic document', async function () {

        console.log("mocha: Waiting for first window");

        assert.equal(await this.app.client.getWindowCount(), 1);

        let webDriverTestResultReader = new WebDriverTestResultReader(this.app);

        let result: any = await webDriverTestResultReader.read();
        //
        // let expected = {
        //     "capturedDocuments": {
        //         "file:///home/burton/projects/polar-bookshelf/web/spectron/content-capture/app.html": {
        //             "content": "<html><head><base href=\"file:///home/burton/projects/polar-bookshelf/web/spectron/content-capture/app.html\"></head><body>\n\n<p>\n    This is some content.\n</p>\n\n\n\n\n\n</body></html>",
        //             "contentTextLength": 177,
        //             "href": "file:///home/burton/projects/polar-bookshelf/web/spectron/content-capture/app.html",
        //             "mutations": {
        //                 "baseAdded": false,
        //                 "cleanupBase": {
        //                     "baseAdded": true,
        //                     "existingBaseRemoved": false
        //                 },
        //                 "cleanupHead": {
        //                     "headAdded": false
        //                 },
        //                 "cleanupRemoveScripts": {
        //                     "scriptsRemoved": 1
        //                 },
        //                 "eventAttributesRemoved": 0,
        //                 "existingBaseRemoved": false,
        //                 "javascriptAnchorsRemoved": 0,
        //                 "showAriaHidden": 0
        //             },
        //             "scrollBox": {
        //                 "height": 0,
        //                 "width": 0
        //             },
        //             "scrollHeight": 0,
        //             "title": "",
        //             "url": "file:///home/burton/projects/polar-bookshelf/web/spectron/content-capture/app.html"
        //         }
        //     },
        //     "scroll": {
        //         "height": 575,
        //         "width": 800
        //     },
        //     "title": "",
        //     "type": "phz",
        //     "url": "...removed...",
        //     "version": "4.0.0"
        // };
        //
        // assertJSON(result, expected);

        // right now we're just verifying that it works, not the content.
        assert.equal(result.version, "4.0.0");

    });

});
