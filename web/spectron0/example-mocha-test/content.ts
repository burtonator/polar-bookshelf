import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {assert} from 'chai';

mocha.setup('bdd');

describe('Basic Test', function() {

    it("basic", async function () {
        assert.ok(1 == 1);
    });

});

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    mocha.run((nrFailures: number) => {
        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));
    });

});


