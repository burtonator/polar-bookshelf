import {Logger} from 'polar-shared/src/logger/Logger';
import {Logging} from '../../../web/js/logger/Logging';
import {BrowserApp} from '../../../web/js/apps/browser/BrowserApp';

const log = Logger.create();

async function start() {

    await Logging.init();

    const app = new BrowserApp();
    await app.start();

}

start().catch(err => log.error("Could not start app: ", err));

