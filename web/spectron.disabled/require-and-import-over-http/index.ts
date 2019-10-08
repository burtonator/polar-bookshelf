import {SpectronMain2} from '../../js/test/SpectronMain2';
import {ResourceRegistry} from '../../js/backend/webserver/ResourceRegistry';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {WebserverConfig} from "../../../../polar-shared-webserver/src/webserver/WebserverConfig";
import {FileRegistry} from "../../../../polar-shared-webserver/src/webserver/FileRegistry";
import {Webserver} from "../../../../polar-shared-webserver/src/webserver/Webserver";

SpectronMain2.create().run(async state => {

    const webserverConfig = new WebserverConfig(__dirname, 12345);

    const fileRegistry = new FileRegistry(webserverConfig);
    const resourceRegistry = new ResourceRegistry();

    const webserver = new Webserver(webserverConfig, fileRegistry, resourceRegistry);
    await webserver.start();

    await state.window.loadFile(FilePaths.join(__dirname, "content.html"));

});



