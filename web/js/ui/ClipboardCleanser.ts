/**
 * Keeps track of the last copy the user did so that we can then request what
 * was copied.
 */
import {Ranges} from '../highlights/text/selection/Ranges';

export class ClipboardCleanser {

    public static register() {

        document.addEventListener('cut', event => this.handleCutOrCopy(event));
        document.addEventListener('copy', event => this.handleCutOrCopy(event));

    }

    private static handleCutOrCopy(event: ClipboardEvent) {

        if (!event.clipboardData) {
            return;
        }

        const sel = window.getSelection();

        if (! sel) {
            return;
        }

        const text = Ranges.toText(sel.getRangeAt(0));

        event.clipboardData.setData('text/plain', text);
        event.clipboardData.setData('text/html', text);
        event.clipboardData.setData('pasted-from-polar', 'true');
        event.preventDefault();

    }

}
