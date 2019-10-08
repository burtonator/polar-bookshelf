import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';

describe('main-app-with-import', async function() {

    Spectron.setup(__dirname);
    this.timeout(300000);

    before(async function() {
        await PolarDataDir.useFreshDirectory('.polar-main-app-with-import');
    });

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});

