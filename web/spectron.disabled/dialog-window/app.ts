import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    state.testResultWriter.write(true);
});
