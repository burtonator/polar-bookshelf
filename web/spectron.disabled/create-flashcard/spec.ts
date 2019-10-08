import {assert} from '@types/chai';
import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';

xdescribe('create-flashcard', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    it('Create flashcard window and make sure they render properly', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        const testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});
