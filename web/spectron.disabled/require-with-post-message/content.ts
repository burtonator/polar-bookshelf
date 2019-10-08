import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");
    // you can also update the result in the renderer
    state.testResultWriter.write(true);
});


