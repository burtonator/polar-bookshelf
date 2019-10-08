import {Progress} from '../../util/ProgressTracker';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Preconditions} from 'polar-shared/src/Preconditions';

const ID = 'polar-determinate-progress-bar';

const log = Logger.create();

const FAST_PROGRESS_CUTOFF = 300;

/**
 * Simple progress bar that we can display at any time on a page without
 * complicated rendering issues or requiring React to be used.  This allows
 * us to easily show a GUI for a download at any point in time.
 */
export class DeterminateProgressBar {

    // TODO: we accept a progress object too
    public static update(value: number | Progress) {

        const progress: number =
            typeof value === 'number' ? value : value.progress;

        if (! progress || progress < 0 || progress > 100) {
            // this is an invalid value...
            return;
        }

        if (! (typeof value === 'number')) {

            if (value.duration < FAST_PROGRESS_CUTOFF && progress < 100) {
                return;
            }

        }

        if (progress === 100 && ! this.get().isPresent()) {
            // there's nothing that needs to be actually done here.  We've been
            // told something was completed but we never actually logged that
            // it was processing which might happen sometimes if we're given
            // the last job.  Either way even if it's a programmers error there
            // is no need to update the UI here.
            return;
        }

        const progressElement = this.getOrCreate();
        progressElement.value = progress;

        if (progress >= 100) {
            this.destroy();
        }

    }

    private static destroy() {

        const timeout = 350;

        const doDestroy = () => {

            const progressElement = this.get().getOrUndefined();

            if (progressElement) {

                if (progressElement.parentElement !== null) {
                    progressElement.parentElement.removeChild(progressElement);
                } else {
                    log.warn("No parent element for progress bar.");
                }

            } else {
                // log.warn("No progress bar to destroy.");
            }

        };

        setTimeout(() => {

            const progressElement = this.get();

            if (! progressElement.isPresent() || progressElement.get().value !== 100) {
                return;
            }

            doDestroy();

        }, timeout);

    }

    private static getOrCreate() {

        const result = this.get();

        if (result.isPresent()) {
            return result.get();
        }

        return this.create();

    }

    private static get(): Optional<HTMLProgressElement> {
        const element = document.getElementById(ID);
        return Optional.of(<HTMLProgressElement> element);
    }

    private static create(): HTMLProgressElement {

        const element: HTMLProgressElement = document.createElement('progress');

        element.value = 0;
        element.max = 100;

        element.id = ID;

        element.style.height = '4px';

        element.style.width = `100%`;

        /// progress.style.backgroundColor='#89ADFD';
        // progress.style.color='#89ADFD';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '99999999999';
        element.style.borderTop = '0';
        element.style.borderLeft = '0';
        element.style.borderRight = '0';
        element.style.borderBottom = '0';
        // element.style.webkitAppearance = 'none';
        // element.style.borderRadius = '0';

        document.body.appendChild(element);

        return element;

    }

}

