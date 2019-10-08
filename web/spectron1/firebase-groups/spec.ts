import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {FirebaseTesting} from "../../js/firebase/FirebaseTesting";

describe('firebase-groups', function() {

    Spectron.setup(__dirname);
    this.timeout(600000);

    it('valid users', async function() {
        FirebaseTesting.validateUsers();
    });

    it('basic tests', async function() {
        await SpectronSpec.create(this.app).waitFor(true);
    });

});
