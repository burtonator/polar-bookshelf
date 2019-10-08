import {Messenger} from '../electron/messenger/Messenger';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class AnnotationSidebarClient {

    public static toggleAnnotationSidebar() {

        Messenger.postMessage({
            message: {
                type: 'toggle-annotation-sidebar',
            }
        }).catch(err => log.error("Could not post message", err));

    }

}
