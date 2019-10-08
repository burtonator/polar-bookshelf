import Toastr from 'toastr';

// needed to enforce that jquery is working.
import $ from '../JQuery';
import {Optional} from 'polar-shared/src/util/ts/Optional';

Toastr.options.toastClass = 'toastr';

/**
 * High level interface to create toaster UI popups for messages.
 */
export class Toaster {

    public static info(message: string, title: string = "", options: ToasterOptions = {}): ToasterRef {
        title = Optional.of(title).getOrElse("");
        return Toastr.info(message, title, this.augmentExtendedOptions(options));
    }

    public static success(message: string, title: string = "", options: ToasterOptions = {}): ToasterRef {
        title = Optional.of(title).getOrElse("");
        return Toastr.success(message, title, this.augmentExtendedOptions(options));
    }

    public static warning(message: string, title: string = "", options: ToasterOptions = {}): ToasterRef {
        title = Optional.of(title).getOrElse("");
        return Toastr.warning(message, title, this.augmentExtendedOptions(options));
    }

    public static error(message: string, title: string = "", options: ToasterOptions = {}): ToasterRef {
        title = Optional.of(title).getOrElse("");
        return Toastr.error(message, title, this.augmentExtendedOptions(options));
    }

    /**
     * Clear a previously raised toast.
     */
    public static clear(ref: ToasterRef) {
        Toastr.clear(<any> ref, {force: true});
    }

    /**
     * We expose remove now but ideally we would remove just the primary toast
     * not the secondary/ancillary ones that might be unrelated.
     */
    public static remove() {
        Toastr.remove();
    }

    /**
     * Create an error that doesn't auto-hide and is a singleton around the same
     * messages and requires the user to acknowledge it...
     *
     * @param message
     */
    public static persistentError(message: string, title: string = "") {

        this.error(message, title, {
            timeOut: 0,
            extendedTimeOut: 0,
            preventDuplicates: true
        });

    }

    private static augmentExtendedOptions(options: ToasterOptions): ToasterOptions {

        const result = Object.assign({}, options);

        if (options.requiresAcknowledgment) {
            Object.assign(result, {
                closeButton: true,
                timeOut: 0,
                extendedTimeOut: 0,
            });
        }

        return result;

    }

}

/**
 * A reference to a toast but this is actually a jquery object. We just don't
 * want to expose it directly for now.
 */
export type ToasterRef = object;

export interface ToasterOptions {
    timeOut?: number;
    extendedTimeOut?: number;
    preventDuplicates?: boolean;
    closeButton?: boolean;
    debug?: boolean;
    newestOnTop?: boolean;
    requiresAcknowledgment?: boolean;
    positionClass?: 'toast-top-center' | 'toast-top-right' | 'toast-top-left' | 'toast-top-full-width';
}

export enum ToasterMessageType {

    SUCCESS = "success",

    INFO = "info",

    WARNING = "warning",

    ERROR = "error"

}


