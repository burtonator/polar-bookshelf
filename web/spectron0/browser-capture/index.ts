import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Capture} from '../../js/capture/Capture';
import {BrowserProfiles} from '../../js/capture/BrowserProfiles';
import BrowserRegistry from '../../js/capture/BrowserRegistry';
import {BrowserProfile} from '../../js/capture/BrowserProfile';

SpectronMain2.create().run(async state => {

    const browser = BrowserRegistry.DEFAULT;

    let browserProfile: BrowserProfile
        = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT');

    const url = "http://www.example.com";

    browserProfile.navigation.navigated.dispatchEvent({link: url});
    browserProfile.navigation.captured.dispatchEvent({});

    browserProfile = Object.assign({}, browserProfile);

    browserProfile.destroy = false;

    const capture = new Capture(browserProfile);

    await capture.start();

    await state.testResultWriter.write(true);

});
