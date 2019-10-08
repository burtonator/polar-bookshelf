
/**
 * Basic structure for defining
 *
 */
import {Browser} from './Browser';

// Electron 3.0 uses Chrome 66 by default.  Version 69 is the latest circa Oct 25 2018

// TODO: clean this up.  there is a lot of code duplication here when we're
// only adding 1 or 2 fields like width and height.

const BrowserRegistry: {[name: string]: Browser} = {

    // Stock Electron UA is:
    //
    // Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) polar-bookshelf/1.0.0-beta13 Chrome/61.0.3163.100 Electron/2.0.2 Safari/537.36
    // Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Electron/3.0.0-beta.5 Safari/537.36

    DESKTOP_850: new Browser({

        name: "DESKTOP_850",
        title: "Desktop",
        type: 'desktop',
        description: "Chrome 66",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        inactive: false,

        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 850,
                height: 768
            },
            viewSize: {
                width: 850,
                height: 786
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    DESKTOP_1024: new Browser({

        name: "DESKTOP_1024",
        title: "Desktop",
        type: 'desktop',
        description: "Chrome 66",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        inactive: false,

        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 1024,
                height: 768
            },
            viewSize: {
                width: 1024,
                height: 786
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    DESKTOP_1280: new Browser({

        name: "DESKTOP_1280",
        title: "Desktop",
        type: 'desktop',
        description: "Chrome 66",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        inactive: false,

        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 1280,
                height: 1024
            },
            viewSize: {
                width: 1280,
                height: 1024
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    DESKTOP_1920: new Browser({

        name: "DESKTOP_1920",
        title: "Desktop",
        type: 'desktop',
        description: "Chrome 66",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        inactive: false,

        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 1920,
                height: 1280
            },
            viewSize: {
                width: 1920,
                height: 1280
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    MOBILE_GALAXY_S8: new Browser({

        name: "MOBILE_GALAXY_S8",
        title: "Galaxy S8",
        type: 'phone',
        description: "Galaxy S8 mobile device (stock)",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        inactive: false,

        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1
        }

    }),

    MOBILE_GALAXY_S8_WITH_CHROME_66: new Browser({

        name: "MOBILE_GALAXY_S8_WITH_CHROME_66",
        title: "Galaxy S8",
        type: 'phone',
        description: "Galaxy S8 mobile device but with Chrome 66",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        inactive: true,

        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1
        }

    }),


    MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_700: new Browser({

        name: "MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_700",
        title: "Galaxy S8",
        type: 'phone',
        description: "Galaxy S8 mobile device running Chrome 66 but with width at 700",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        inactive: true,

        /**
         * @type Electron.Parameters
         */
        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 700,
                height: 905
            },
            viewSize: {
                width: 700,
                height: 905
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_750: new Browser({

        name: "MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_750",
        title: "Galaxy S8",
        type: 'phone',
        description: "Galaxy S8 mobile device running Chrome 66 but with width at 750",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36",
        inactive: true,

        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 750,
                height: 970
            },
            viewSize: {
                width: 750,
                height: 970
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

    CHROME_66: new Browser({

        name: "CHROME_66",
        title: "Chrome 66",
        type: 'desktop',
        description: "Chrome 66",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        inactive: true,

        deviceEmulation: {
            screenPosition: "desktop",
            screenSize: {
                width: 1024,
                height: 768
            },
            viewSize: {
                width: 1024,
                height: 786
            },
            viewPosition: {x: 0, y: 0},
            deviceScaleFactor: 0,
            scale: 1

        }

    }),

};

// setup a default browser...
BrowserRegistry.DEFAULT = BrowserRegistry.MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_750;

// BrowserRegistry.DEFAULT = BrowserRegistry.MOBILE_GALAXY_S8;



export default BrowserRegistry;
