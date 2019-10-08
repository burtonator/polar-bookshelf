import * as React from 'react';
import {RepositoryApp} from '../../../web/js/apps/repository/RepositoryApp';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

async function start() {

    await Logging.init();

    await new RepositoryApp().start();

}

start().catch(err => log.error("Could not start app: ", err));
