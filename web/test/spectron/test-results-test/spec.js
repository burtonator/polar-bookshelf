const assert = require('assert');
const {assertJSON} = require("../../../js/test/Assertions");
const {Functions} = require("polar-shared/src/util/Functions");
const {Spectron} = require("../../../js/test/Spectron");
const {TestResultsReceiver} = require("../../../web/js/test/results/TestResultsReceiver");

const TIMEOUT = 10000;

describe('TestResults', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('Receive results', async function () {

        let testResultsReceiver = new TestResultsReceiver(this.app);

        assert.equal(await this.app.client.getWindowCount(), 1);

        assert.equal(await testResultsReceiver.receive(), "hello");

    });

});
