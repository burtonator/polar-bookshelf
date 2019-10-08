import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {RendererAnalytics} from '../../js/ga/RendererAnalytics';
import ReactGA from 'react-ga';

import ua from 'universal-analytics';

SpectronRenderer.run(async () => {
    RendererAnalytics.event({category: 'test', action: 'test'})
    RendererAnalytics.pageview("/");

    const TRACKING_ID = 'UA-122721184-1';

    ReactGA.initialize(TRACKING_ID, {debug: true});
    // ReactGA.event(args, trackerNames);
    ReactGA.pageview("/");

    console.log("Sent analyitics... ")

    const visitor = ua(TRACKING_ID);

    visitor.pageview("/").send()

    visitor.event("Event Category", "Event Action").send()

    setTimeout(() => {
        visitor.pageview("/").send();
        console.log("FIXME: sent another pageview;")

        visitor.event("Event Category", "Event Action").send()

    }, 2000);



});


