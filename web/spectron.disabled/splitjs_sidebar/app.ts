import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Split from 'split.js';

SpectronRenderer.run(async () => {

    var split = Split(['#three', '#four'], {
        sizes: [50, 50],
        minSize: 100,
        gutterSize: 7
    });

    // this will collapse it:
    // split.collapse(1);

});

