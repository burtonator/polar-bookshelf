import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('doc-info-advertisements', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    it('Make sure the receiving app gets messages from the sending app', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
