import {SpectronMain2} from '../../js/test/SpectronMain2';
import {SentryLogger} from '../../js/logger/SentryLogger';

SpectronMain2.create().run(async state => {

    let sentryLogger = new SentryLogger();
    sentryLogger.error("This is a false error from main: ", new Error("Fake error from main"));

    await state.window.loadURL(`file://${__dirname}/app.html`);

});
