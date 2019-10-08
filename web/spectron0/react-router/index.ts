import {SpectronMain2} from '../../js/test/SpectronMain2';
import {DownloadItem, WebContents} from "electron";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {SpectronWebappMain} from "../../js/test/SpectronWebappMain";
import {Rewrite} from "polar-shared-webserver/src/webserver/Rewrites";

const webRoot = FilePaths.join(__dirname, "..", "..", "..", "web", 'spectron0', 'react-router');
const appRoot = __dirname;

const rewrites: ReadonlyArray<Rewrite> = [

    {
        "source": "/user",
        "destination": "/content.html"
    },
    {
        "source": "/",
        "destination": "/content.html"
    },

];

SpectronWebappMain.run({
    webRoot,
    appRoot,
    path: "/",
    rewrites
});
