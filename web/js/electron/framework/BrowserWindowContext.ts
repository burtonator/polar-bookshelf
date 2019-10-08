import {BrowserWindowRegistry, BrowserWindowTag} from './BrowserWindowRegistry';
import {BrowserWindow} from 'electron';
import {Messenger} from '../messenger/Messenger';

/**
 * Pass messages (consistenly) to a given BrowserWindow (or BrowserWindows), by
 * using tags and the BrowserWindowRegister and postMessage.
 */
export class BrowserWindowContext {

    public static async postMessage<T>(tag: BrowserWindowTag, message: T) {
        const browserWindowIDs = BrowserWindowRegistry.tagged(tag);

        for (const id of browserWindowIDs) {
            const browserWindow = BrowserWindow.fromId(id);
            await Messenger.postMessageWithElectronBrowserWindow(message, browserWindow);
        }

    }

}
