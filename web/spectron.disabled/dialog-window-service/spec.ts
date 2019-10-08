import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';
import {assertJSON} from '../../js/test/Assertions';
import {SpectronSpec} from '../../js/test/SpectronSpec';

const assert = require('assert');

describe('dialog-window-service', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    it('create dialog window and hide/show it multiple times', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
