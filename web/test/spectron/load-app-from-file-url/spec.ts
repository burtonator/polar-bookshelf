import {WebDriverTestResultReader} from '../../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../../js/test/Spectron';

const assert = require('assert');
const {Functions} = require("polar-shared/src/util/Functions");

describe('example-test', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('shows an basic initial window', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});
