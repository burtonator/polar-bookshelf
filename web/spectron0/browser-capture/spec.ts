import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';

// we can change the polar data dir with the following
// PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');

describe('Browser Capture', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    before(async function() {
        await PolarDataDir.useFreshDirectory('.polar-browser-capture');
    });

    it('Test browser capturing and writing to a file.', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
