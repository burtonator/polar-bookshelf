import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Logger} from 'polar-shared/src/logger/Logger';
import {assert} from "chai";
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Files} from 'polar-shared/src/util/Files';
import {Logging} from '../../js/logger/Logging';
import {PolarDataDir} from '../../js/test/PolarDataDir';

const log = Logger.create();

SpectronMain2.create().run(async state => {

    await PolarDataDir.reuseDirectory('.polar-persistent-error-logger');

    assert.ok(PolarDataDir.get(), "There is no POLAR_DATA_DIR defined");

    const path = FilePaths.join(PolarDataDir.get()!, "logs", "error.log");

    assert.ok( ! await Files.existsAsync(path), "File still exists for some reason: " + path);

    await Logging.init();

    assert.ok(await Files.existsAsync(path), "The error.log file does not exist at: " + path);

    await state.window.loadURL(`file://${__dirname}/app.html`);

    log.error("This is from the main process: ", new Error("Fake error in main process"));

    // FIXME: make sure we have the data now.

    await log.sync();

});
