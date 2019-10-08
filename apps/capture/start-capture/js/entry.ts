import {StartCaptureApp} from "../../../../web/js/capture/controller/StartCaptureApp";
import {Logger} from 'polar-shared/src/logger/Logger';
import {Logging} from '../../../../web/js/logger/Logging';

const log = Logger.create();

async function start() {

    await Logging.init();

    new StartCaptureApp().start();

}

start().catch(err => log.error("Could not start app: ", err));
