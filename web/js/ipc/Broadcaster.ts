
import {BrowserWindow, ipcMain} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Broadcasters} from './Broadcasters';
import {BrowserWindowReference} from '../ui/dialog_window/BrowserWindowReference';

const log = Logger.create();

/**
 * When we receive a message, we broadcast it to all the renderers.  Anyone not
 * listening just drops the message.  This makes it easy to implement various
 * forms of message communication but one of them is shared state across the
 * web browsers.
 */
export class Broadcaster {

    private channel: string;

    /**
     *
     * @param inputChannel The channel of the event we're listening to for new message
     * @param outputChannel The channel to re-send the event on to other renderer processes.
     */
    constructor(inputChannel: string, outputChannel: string = inputChannel) {

        this.channel = inputChannel;

        // TODO: require that this is registered via start (not automatically).
        ipcMain.on(inputChannel, (event: Electron.Event, arg: any) => {

            log.info("Forwarding message: " , inputChannel, event);

            const senderBrowserWindowReference
                = new BrowserWindowReference(BrowserWindow.fromWebContents(event.sender).id);

            Broadcasters.send(outputChannel, arg, senderBrowserWindowReference);

        });

    }

}
