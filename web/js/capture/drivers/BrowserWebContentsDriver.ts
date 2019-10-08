import {AbstractWebviewWebContentsDriver} from './AbstractWebviewWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class BrowserWebContentsDriver extends AbstractWebviewWebContentsDriver {

    constructor(browserProfile: BrowserProfile) {
        super(browserProfile, "./apps/browser/index.html");
    }

}
