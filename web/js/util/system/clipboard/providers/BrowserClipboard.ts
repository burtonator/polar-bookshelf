import {Clipboard} from '../Clipboard';

declare var navigator: INavigatorWithClipboard;

export class BrowserClipboard implements Clipboard{

    public writeText(text: string) {
        navigator.clipboard.writeText(text);
    }

    public static supported() {
        return navigator && navigator.clipboard && navigator.clipboard.writeText;
    }

}

interface INavigatorWithClipboard {
    readonly clipboard: INavigatorClipboard;
}

interface INavigatorClipboard {
    writeText(text: string): void;
}
