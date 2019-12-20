import {app} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MainApp} from './web/js/apps/main/MainApp';
import {Cmdline} from './web/js/electron/Cmdline';
import {Logging} from './web/js/logger/Logging';
import {Datastores} from './web/js/datastore/Datastores';
import process from 'process';
import {LazyWriteDatastore} from './web/js/datastore/LazyWriteDatastore';
import {Version} from "polar-shared/src/util/Version";

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (process.env.POLAR_DISABLE_HARDWARE_ACCELERATION === 'true') {
    console.log("Disabling hardware acceleration");
    app.disableHardwareAcceleration();
}

if (!hasSingleInstanceLock) {
    console.error("Quiting.  App is single instance.");
    app.quit();
}

// needed to disable site isolation because it doesn't actually allow us to
// disable web security properly.
app.commandLine.appendSwitch('disable-site-isolation-trials');

async function launch() {

    console.log("Running with CWD: " + process.cwd());
    console.log("Running with Node version: " + process.version);
    console.log("Running with Electron version: " + process.versions.electron);
    console.log("Running with Polar version: " + Version.get());

    const log = Logger.create();

    const datastore = new LazyWriteDatastore(Datastores.create());

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);
    const {mainAppController} = await mainApp.start();

}

app.on('ready', async () => {

    launch().catch(err => console.error("Unable to launch app: ", err));

});
