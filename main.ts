import {app} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MainApp} from './web/js/apps/main/MainApp';
import {Cmdline} from './web/js/electron/Cmdline';
import {Logging} from './web/js/logger/Logging';
import {Datastores} from './web/js/datastore/Datastores';
import process from 'process';
import {LazyWriteDatastore} from './web/js/datastore/LazyWriteDatastore';

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

    console.log("Running with app path: " + app.getAppPath());
    console.log("Running with CWD: " + process.cwd());
    console.log("Running with node version: " + process.version);

    const log = Logger.create();

    const datastore = new LazyWriteDatastore(Datastores.create());

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);
    const {mainAppController} = await mainApp.start();

    const fileArg = Cmdline.getDocArg(process.argv);

    if (fileArg) {
        log.info("Opening file given on the command line: " + fileArg);
        await mainAppController.handleLoadDoc(fileArg);
    }

}

app.on('ready', async () => {

    launch().catch(err => console.error("Unable to launch app: ", err));

});
