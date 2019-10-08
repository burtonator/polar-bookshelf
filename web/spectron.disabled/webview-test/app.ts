import {webContents, webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Promises} from '../../js/util/Promises';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

function getContentHost() {
    return document.querySelector("#content")! as Electron.WebviewTag;
}

SpectronRenderer.run(async () => {

    const content = getContentHost();

    content.addEventListener('console-message', (consoleMessageEvent: Electron.ConsoleMessageEvent) => {

        const prefix = 'From webview: ';

        switch (consoleMessageEvent.level) {

            case -1:
                log.debug(prefix + consoleMessageEvent.message);
                break;

            case 0:
                log.info(prefix + consoleMessageEvent.message);
                break;

            case 1:
                log.warn(prefix + consoleMessageEvent.message);
                break;

            case 2:
                log.error(prefix + consoleMessageEvent.message);
                break;

        }

    });


});


