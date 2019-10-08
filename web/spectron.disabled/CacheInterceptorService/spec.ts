import {SpectronSpec} from '../../js/test/SpectronSpec';
import {Spectron} from '../../js/test/Spectron';
import {MockPHZWriter} from '../../js/phz/MockPHZWriter';
import {FilePaths} from 'polar-shared/src/util/FilePaths';


xdescribe("CacheInterceptorService", function () {

    this.timeout(30000);

    Spectron.setup(__dirname);

    const path = FilePaths.createTempName("cache-interceptor-service.phz");

    before(async function() {

        await MockPHZWriter.write(path);

    });

    it('Load PHZ file via cache', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
