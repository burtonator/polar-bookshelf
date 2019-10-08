import {BrowserWindow} from "electron";
import {BrowserWindowReference} from '../ui/dialog_window/BrowserWindowReference';

/**
 * @ElectronMainContext
 */
export class Broadcasters {

    /**
     * Send the given message, to the given channel, to all current
     * BrowserWindows.  If nothing is listening on that 'channel' the message
     * is ignored.
     */
    public static send(channel: string, message: any, ...excluding: BrowserWindowReference[]) {

        const excludingIDs = excluding.map(current => current.id);

        let browserWindows = BrowserWindow.getAllWindows();

        // now filter out the excluding windows so that we don't
        // re-broadcast to them.
        browserWindows = browserWindows.filter(current => ! excludingIDs.includes(current.id));

        browserWindows.forEach((window) => {
            window.webContents.send(channel, message);
        });

    }

}
