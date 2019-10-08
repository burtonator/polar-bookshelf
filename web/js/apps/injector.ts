// inject the right bundle depending on whether we're using chrome or electron.

import {Electron} from "../Electron";
import {injectScript} from "../utils";

if (Electron.isElectron()) {

    console.log("Injecting electron bundle");
    injectScript("../../web/js/apps/electron-bundle.js")
        .catch(err => console.error(err))
} else {
    console.log("Injecting chrome bundle");
    injectScript("../../web/js/apps/chrome-bundle.js")
        .catch(err => console.error(err))
}


