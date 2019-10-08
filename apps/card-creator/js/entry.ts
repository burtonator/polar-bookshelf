import {CreateFlashcardApp} from '../../../web/js/apps/card_creator/CreateFlashcardApp';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Logging} from '../../../web/js/logger/Logging';

const log = Logger.create();

async function start() {

    await Logging.init();

    let cardCreatorApp = new CreateFlashcardApp();
    await cardCreatorApp.start();

}

start().catch(err => log.error("Could not start app: ", err));
