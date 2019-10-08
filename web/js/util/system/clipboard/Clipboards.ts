import {clipboard} from 'electron';
import {Clipboard} from './Clipboard';
import {ElectronClipboard} from './providers/ElectronClipboard';
import {BrowserClipboard} from './providers/BrowserClipboard';
import {NullClipboard} from './providers/NullClipboard';


export class Clipboards {

    public static getInstance(): Clipboard {

        if (ElectronClipboard.supported()) {
            return new ElectronClipboard();
        } else if (BrowserClipboard.supported()) {
            return new BrowserClipboard();
        }

        return new NullClipboard();

    }

}

