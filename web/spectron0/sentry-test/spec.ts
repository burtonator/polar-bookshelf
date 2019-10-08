import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('sentry', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    xit('test sentry support', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
