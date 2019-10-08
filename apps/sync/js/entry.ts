import {Logger} from 'polar-shared/src/logger/Logger';
import {SyncApp} from "../../../web/js/apps/sync/SyncApp";
import {Logging} from '../../../web/js/logger/Logging';

const log = Logger.create();

async function start() {

    await Logging.init();

    const app = new SyncApp();
    await app.start();

}

start().catch(err => log.error("Could not start app: ", err));
