import {Clipboard} from '../Clipboard';
import {clipboard} from "electron";
import {isPresent} from 'polar-shared/src/Preconditions';

export class ElectronClipboard implements Clipboard{

    public writeText(text: string) {
        clipboard.writeText(text);
    }

    public static supported() {
        return isPresent(clipboard);
    }

}
