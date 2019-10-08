import {Logger} from 'polar-shared/src/logger/Logger';
import {Logging} from '../../../web/js/logger/Logging';
import {CaptureWebviewApp} from '../../../web/js/apps/capture_webview/CaptureWebviewApp';

const log = Logger.create();

async function start() {

    await Logging.init();

    const app = new CaptureWebviewApp();
    await app.start();

}

start().catch(err => log.error("Could not start app: ", err));
