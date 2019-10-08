import {Elements} from '../../util/Elements';

const ID = 'polar-blackout';

export class Blackout {

    public static toggle(value: boolean, opts: BlackoutOpts = {}) {

        if (value) {
            this.enable(opts);
        } else {
            this.disable();
        }

    }

    public static enable(opts: BlackoutOpts = {}) {

        // always make sure the blackout element is removed so we don't double
        // enable it...
        if (this.isEnabled()) {
            return;
        }

        const blackoutElement =
            Elements.createElementHTML(`<div id="${ID}" style="">`);

        blackoutElement.style.height = '100%';
        blackoutElement.style.width = '100%';
        blackoutElement.style.position = 'absolute';
        blackoutElement.style.top = '0';
        blackoutElement.style.left = '0';
        blackoutElement.style.backgroundColor = '#000000';
        blackoutElement.style.opacity = '0.3';

        blackoutElement.style.zIndex = '999';

        if (opts.noPointerEvents) {
            blackoutElement.style.pointerEvents = 'none';
        }

        document.body.appendChild(blackoutElement);

    }

    public static disable() {

        const element = document.getElementById(ID);

        if (element && element.parentElement) {
            // only remove it if it actually exists and is part of the UI.
            element.parentElement.removeChild(element);
        }

    }

    /**
     * Return true if the blackout is enabled.
     */
    public static isEnabled() {
        return document.getElementById(ID) !== null;
    }

}

export interface BlackoutOpts {

    /**
     * When text is displayed we show a div above the blackout with the given text.
     */
    readonly text?: string;

    /**
     * When the element is given we display this above the blackout.
     */
    readonly element?: HTMLElement;

    /**
     * Prevents the blackout from receiving pointer events and allows them
     * to go through to the elements it covers.
     */
    readonly noPointerEvents?: boolean;

}
