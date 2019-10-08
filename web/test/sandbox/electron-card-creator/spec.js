const assert = require('assert');
const {assertJSON} = require("../../../js/test/Assertions");
const {Functions} = require("polar-shared/src/util/Functions");
const {Spectron} = require("../../../js/test/Spectron");

const TIMEOUT = 10000;

describe('electron card creator', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('basic', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

    });

});
