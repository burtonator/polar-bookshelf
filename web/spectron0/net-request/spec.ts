import {SpectronSpec} from '../../js/test/SpectronSpec';
import {Spectron} from '../../js/test/Spectron';
import {MockPHZWriter} from '../../js/phz/MockPHZWriter';
import {FilePaths} from 'polar-shared/src/util/FilePaths';


describe("net-request", function () {

    this.timeout(30000);

    Spectron.setup(__dirname);

    it('Test basic request', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
