import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';

const ID = 'polar-progress-bar';

const log = Logger.create();

/**
 * Simple progress bar that we can display at any time on a page without
 * complicated rendering issues or requiring React to be used.  This allows
 * us to easily show a GUI for a download at any point in time.
 */
export class IndeterminateProgressBar {

    public destroy() {

        const progressElement = IndeterminateProgressBar.getProgressElement().getOrUndefined();

        if (progressElement) {

            if (progressElement.parentElement !== null) {
                progressElement.parentElement.removeChild(progressElement);
            } else {
                log.warn("No parent element for progress bar.");
            }

        } else {
            // log.warn("No progress bar to destroy.");
        }

    }

    private static getProgressElement(): Optional<HTMLProgressElement> {
        const element = document.getElementById(ID);
        return Optional.of(<HTMLProgressElement> element);
    }

    public static create(): IndeterminateProgressBar {

        const current = this.getProgressElement();

        if (current.isPresent()) {
            return new IndeterminateProgressBar();
        }

        const element = document.createElement('div');

        element.setAttribute('class', 'progress-indeterminate-slider');

        element.innerHTML = `
            <div class="progress-indeterminate-line"></div>
            <div class="progress-indeterminate-subline progress-indeterminate-inc"></div>
            <div class="progress-indeterminate-subline progress-indeterminate-dec"></div>
        `;

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

        return new IndeterminateProgressBar();

    }

}

