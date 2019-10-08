const path = require('path');
const {Spectron} = require("../../js/test/Spectron");

describe('Open specific PHZ file from command line', function () {

    this.timeout(30000);

    let examplePHZ = path.join(__dirname, "../../../docs/example.phz");

    Spectron.setup(path.join(__dirname, '../../..'), examplePHZ);

    // TODO: disabling this right now as command line file loading isn't a priority.

    xit('PDF file loads', async function () {

        // FIXME: we have to verify that the PHZ is actually loaded... not sure
        // how to do this yet.
        //ait this.app.client.waitForExist(`iframe[src="https://en.m.wikipedia.org/wiki/Prime_number"]`);

    });

});
