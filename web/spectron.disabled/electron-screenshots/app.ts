import {webContents, webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Promises} from '../../js/util/Promises';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");
    // setZoomLevel on teh iframe seems to change the root webFrame

});


