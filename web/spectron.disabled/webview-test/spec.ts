import {assert} from '@types/chai';
import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';

xdescribe('webview-test', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    xit('shows an basic initial window', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        const testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});
