import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

// we can change the polar data dir with the following
// PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');

xdescribe('require-and-import-over-http', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    it('Test HTTP webapps', async function() {
        await SpectronSpec.create(this.app).waitFor(true);
    });

});

