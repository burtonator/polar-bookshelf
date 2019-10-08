import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';

describe('main-app', function() {

    Spectron.setup(__dirname);
    this.timeout(20000);

    before(async function() {
        await PolarDataDir.useFreshDirectory('.polar-main-app');
    });

    it('create the repository view', async function() {
        // await PolarDataDir.useFreshDirectory('.polar-main-app');

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
