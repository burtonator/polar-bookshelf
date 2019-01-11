import {Percentage} from '../../util/ProgressTracker';
import {Logger} from '../../logger/Logger';
import {Optional} from '../../util/ts/Optional';

const ID = 'polar-determinate-progress-bar';

const log = Logger.create();

/**
 * Simple progress bar that we can display at any time on a page without
 * complicated rendering issues or requiring React to be used.  This allows
 * us to easily show a GUI for a download at any point in time.
 */
export class DeterminateProgressBar {

    public static update(val: number) {

        if (! val || val < 0 || val > 100) {
            return;
        }

        const progressElement = this.getOrCreate();
        progressElement.value = val;

        if (val >= 100) {
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

