import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {ProgressBar} from '../../js/ui/progress_bar/ProgressBar';

SpectronRenderer.run(async () => {

    const intervals = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    let remaining = Object.assign([], intervals);

    const progressBar = ProgressBar.create(false)

    const timeout = 500;

    function updateProgress() {

        if (remaining.length === 0) {
            remaining = Object.assign([], intervals);
        }

        progressBar.update(remaining.shift()!);

        setTimeout(updateProgress, 500);

    }

    setTimeout(updateProgress, 500);

});




