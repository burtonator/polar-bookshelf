import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Logging} from '../../js/logger/Logging';
import {PolarDataDir} from '../../js/test/PolarDataDir';

const log = Logger.create();

SpectronRenderer.run(async (state) => {

    await PolarDataDir.reuseDirectory('.polar-persistent-error-logger');

    await Logging.init();

    log.error("This is from the renderer process: ", new Error("Fake error in the renderer process"));

    await log.sync();

    await state.testResultWriter.write(true);

});
