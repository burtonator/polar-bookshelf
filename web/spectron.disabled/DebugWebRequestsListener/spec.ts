import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Spectron} from '../../js/test/Spectron';

const assert = require('assert');

describe('DebugWebRequestsListener', function() {

    this.timeout(30000);

    before(async function() {
        const logsDir = FilePaths.tmpfile("DebugWebRequestsListener");
        await Files.createDirAsync(logsDir);
        await Files.removeAsync(FilePaths.join(logsDir, "polar.log"));
    });

    Spectron.setup(__dirname);

    xit('Make sure they are written to the log.', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        const testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

        return true;

    });

});
