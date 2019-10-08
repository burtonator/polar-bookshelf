import {AppPath} from '../electron/app_path/AppPath';
import {SpectronMain2} from './SpectronMain2';
import {PolarDataDir} from './PolarDataDir';
import {WebserverConfigs} from "polar-shared-webserver/src/webserver/WebserverConfig";
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";
import {Rewrite} from "polar-shared-webserver/src/webserver/Rewrites";

export class SpectronWebappMain {

    public static run(opts: ISpectronWebappOpts) {

        console.log("Running spectron webapp with: ", opts);

        const {appRoot, webRoot, path, rewrites} = opts;

        AppPath.set(appRoot);

        SpectronMain2.create().run(async state => {

            await PolarDataDir.useFreshDirectory('.polar-firebase-datastore');

            // the webserver must be running as firebase won't load without being on an
            // HTTP URL

            console.log("Running with app path: " + AppPath.get());

            console.log("Running with web root: " + webRoot);

            const webserverConfig = WebserverConfigs.create({dir: webRoot, port: 8005, rewrites});

            const fileRegistry = new FileRegistry(webserverConfig);
            const webserver = new Webserver(webserverConfig, fileRegistry);

            try {
                await webserver.start();
            } catch (e) {
                console.warn("Webserver already running.");
            }

            const url = `http://localhost:8005${path}`;
            await state.window.loadURL(url);

        });

    }

}

export interface ISpectronWebappOpts {

    readonly webRoot: string;

    readonly appRoot: string;

    /**
     * The path to load in electron when the app is ready.
     */
    readonly path: string;

    readonly rewrites?: ReadonlyArray<Rewrite>;

}
