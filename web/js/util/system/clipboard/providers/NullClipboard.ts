import {Clipboard} from '../Clipboard';

/**
 * A clipboard which doesn't actually do anything.
 */
export class NullClipboard implements Clipboard {

    public writeText(text: string) {
        // noop
    }

    public static supported() {
        return true;
    }

}
