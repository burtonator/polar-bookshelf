import {ipcRenderer} from "electron";
import {ToasterMessage} from './ToasterMessage';
import {ToasterMessages} from './ToasterMessages';
import {ToasterMessageType, Toaster} from './Toaster';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();


/**
 * Simple app that can display toaster notifications sent via broadcast.
 */
export class ToasterService {

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on(ToasterMessages.CHANNEL, (event: Electron.EventEmitter,
                                                     toasterMessage: ToasterMessage) => {

                switch (toasterMessage.type) {
                    case ToasterMessageType.SUCCESS:
                        Toaster.success(toasterMessage.message, toasterMessage.title, toasterMessage.options);
                        break;
                    case ToasterMessageType.INFO:
                        Toaster.info(toasterMessage.message, toasterMessage.title, toasterMessage.options);
                        break;
                    case ToasterMessageType.WARNING:
                        Toaster.warning(toasterMessage.message, toasterMessage.title, toasterMessage.options);
                        break;
                    case ToasterMessageType.ERROR:
                        Toaster.error(toasterMessage.message, toasterMessage.title, toasterMessage.options);
                        break;
                }

            });

        }

        log.info("started");

    }

}
