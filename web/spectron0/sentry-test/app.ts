import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {SentryLogger} from '../../js/logger/SentryLogger';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    let sentryLogger = new SentryLogger();
    sentryLogger.error("This is a false error from renderer: ", new Error("Fake error from renderer"));

    await state.testResultWriter.write(true);
});
