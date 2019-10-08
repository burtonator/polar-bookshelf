import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

// we can change the polar data dir with the following
// PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');

describe('Firebase Cloud Aware Datastore', function() {

    Spectron.setup(__dirname);

    it('basic tests', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});

