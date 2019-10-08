import {Logger} from "polar-shared/src/logger/Logger";
import {ProgressInfo} from "builder-util-runtime";
import electron, {ipcRenderer} from 'electron';
import {ProgressBar} from "../ui/progress_bar/ProgressBar";
import {DeterminateProgressBar} from "../ui/progress_bar/DeterminateProgressBar";
import {ReactInjector} from '../ui/util/ReactInjector';
import {RestartForUpdateButton} from './RestartForUpdateButton';
import {RestartForUpdateButtons} from './RestartForUpdateButtons';

const log = Logger.create();

export class UpdatesController {

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on('app-update:download-progress', (event: any, progress: ProgressInfo) => {
                this.onProgressInfo(progress);
            });

            ipcRenderer.on('app-update:update-downloaded', () => {
                this.onUpdateDownloaded();
            });

        }

        log.info("started");

    }

    private onProgressInfo(progress: ProgressInfo) {

        const percent = Math.floor(progress.percent);

        DeterminateProgressBar.update(percent);

    }

    private onUpdateDownloaded() {
        RestartForUpdateButtons.create();
    }

}
