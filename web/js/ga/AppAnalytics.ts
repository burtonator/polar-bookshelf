import {Logger} from '../logger/Logger';
import {Hashcodes} from '../Hashcodes';
import {IAnalytics, IResponse} from './GA';
import {Version} from '../util/Version';
import os from 'os';

const log = Logger.create();

const VERSION = Version.get();

/**
 * Idiomatic analytics interface without having to specify all fields per
 * metric.
 */
export class AppAnalytics {

    private readonly analytics: IAnalytics;

    constructor(analytics: IAnalytics) {
        this.analytics = analytics;
    }


    /**
     * Should be called on init to track state of the app. Product version, etc.
     */
    public async init() {

        // this.analytics.set('version', VERSION)
        //     .catch( err => log.error("Could not send tracking information: ", err));

    }

    public set(key: string, value: number | string) {

        // TODO: for soem reason this doesn't actually return a promise.
        this.analytics.set(key, value);

    }

    public screen(screenName: string) {

        // TODO: record OS too...

        log.info("Viewer ready... ");

        const appName = "polar-bookshelf";
        const appVer = VERSION;
        const appID = "io.inputneuron.polar";

        const appInstallerID = "unknown";

        // get a hash of the hostname.  We don't care about the actual
        // hostname value and don't want to compromise someone's privacy but
        // we want some sort of tracking cookie to understand user behavior.
        const clientID = Hashcodes.createID(os.hostname());

        this.analytics.screen(appName, appVer, appID, appInstallerID, screenName, clientID)
            .catch( err => log.warn("Could not send tracking information: ", err));

        // TODO: using pageview too as I don't think GA is using screens in our use case.
        this.analytics.pageview("localhost", screenName, screenName, clientID)
            .catch( err => log.warn("Could not send tracking information: ", err));

        log.info(`Sent GA tracking info for screen ${screenName}`);

    }

}
