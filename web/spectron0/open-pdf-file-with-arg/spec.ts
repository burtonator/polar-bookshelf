
import assert from 'assert';
import {Files} from 'polar-shared/src/util/Files';
import {Spectron, TBrowser} from '../../js/test/Spectron';
const path = require('path');

describe('Open specific PDF file from command line', function () {
    this.timeout(30000);

    const examplePDF = path.join(__dirname, "../../../docs/example.pdf");

    Spectron.setup(path.join(__dirname, '../../..'), examplePDF);

    // TODO: disabling this right now as command line file loading isn't a priority.

    xit('PDF file loads', async function () {

        assert.ok(await Files.existsAsync(examplePDF));

        // assert.equal(await this.app.client.getWindowCount(), 2);

        const client: TBrowser = this.app.client;

        // console.log("FIXME: " + client.getTitle());

        console.log("OK.. both windows are up.");

        await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

        return true;

    });

});
