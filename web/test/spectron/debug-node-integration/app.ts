import {SpectronRenderer} from '../../../js/test/SpectronRenderer';
import {Files} from 'polar-shared/src/util/Files';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    if(typeof require === 'function') {
        if(await Files.existsAsync("/home/burton/.polar")) {
            console.log("dir exists!");
        }
    } else {
        console.warn("No node integration");
    }
});
