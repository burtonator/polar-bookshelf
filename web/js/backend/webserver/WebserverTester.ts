import {AppPath} from "../../electron/app_path/AppPath";
import {AsyncFunction} from '../../util/AsyncWorkQueue';
import {WebserverConfig} from "polar-shared-webserver/src/webserver/WebserverConfig";
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";

export class WebserverTester {

    public static async run(dir: string) {

        AppPath.set(dir);
        const webserverConfig = new WebserverConfig(AppPath.get(), 8005);
        const fileRegistry = new FileRegistry(webserverConfig);
        const webserver = new Webserver(webserverConfig, fileRegistry);

        try {
            await webserver.start();
        } catch (e) {
            console.warn("Webserver already running.");
            throw e;
        }

    }

}

