import {WebserverCerts} from '../web/js/backend/webserver/WebserverCerts';
import {DefaultRewrites} from "polar-backend-shared/src/webserver/DefaultRewrites";
import {WebserverConfigs} from "polar-shared-webserver/src/webserver/WebserverConfig";
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";

const webserverConfig = WebserverConfigs.create({
   dir: 'dist/public',
   port: 443,
   host: 'localhost',
   useSSL: true,
   ssl: {
       cert: WebserverCerts.CERT,
       key: WebserverCerts.KEY,
   },
   rewrites: DefaultRewrites.create()
});

const fileRegistry = new FileRegistry(webserverConfig);

const webserver = new Webserver(webserverConfig, fileRegistry);
webserver.start()
    .catch(err => console.log("Unable to start webserver: ", err));

