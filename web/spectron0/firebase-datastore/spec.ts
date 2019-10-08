import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('Firebase Datastore', function() {

    Spectron.setup(__dirname);

    it('basic tests', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
