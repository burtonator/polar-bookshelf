import {Logger} from 'polar-shared/src/logger/Logger';
import {BrowserProfiles} from '../web/js/capture/BrowserProfiles';
import {DiskDatastore} from '../web/js/datastore/DiskDatastore';
import {Args} from '../web/js/electron/capture/Args';
import {Capture} from '../web/js/capture/Capture';
import BrowserRegistry from '../web/js/capture/BrowserRegistry';
import {Cmdline} from '../web/js/electron/Cmdline';

const electron = require('electron');
const app = electron.app;


const log = Logger.create();

const diskDatastore = new DiskDatastore();

const args = Args.parse(process.argv);

const browser = BrowserRegistry[args.browser];

if (! browser) {
    throw new Error("No browser defined for: " + args.browser);
}

app.on('ready', function() {

    (async () => {

        await diskDatastore.init();

        // TODO don't use directory logging now as it is broken.
        // await Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if (! url) {

            if (! url) {
                console.warn("URL is required.");
                app.quit();
                return;
            }

            url = "https://www.example.com";

        }

        log.info("Using browser profile: " + args.profile);

        const browserProfile = BrowserProfiles.toBrowserProfile(browser, args.profile);

        // we already know all the inputs here...
        browserProfile.navigation.navigated.dispatchEvent({link: url});
        browserProfile.navigation.captured.dispatchEvent({});

        console.log("Going to capture URL: " + url);

        // TODO: sync up args + CaptureOpts
        const captureOpts = {
            amp: args.amp
        };

        const capture = new Capture(browserProfile, captureOpts);

        await capture.start();

        if (args.quit) {
            log.info("Capture finished.  Quitting now");
            app.quit();
        } else {
            log.info("Not quitting (yielding to --no-quit=true).")
        }

    })().catch(err => console.error(err));

});
