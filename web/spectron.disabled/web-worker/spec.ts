import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

xdescribe('web-worker', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    xit('shows an basic initial window', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
