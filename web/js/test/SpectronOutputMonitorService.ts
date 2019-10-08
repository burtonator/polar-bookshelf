// import {Application} from 'spectron';
import {Preconditions} from 'polar-shared/src/Preconditions';

const TIMEOUT = 250;

/**
 * Keep a background monitor to read logs and then write them to the main process.
 */
export class SpectronOutputMonitorService {

    private app: any;

    private stopped: boolean = false;

    constructor(app: any) {
        this.app = Preconditions.assertNotNull(app, "app");
        this.stopped = false;
    }

    start() {
        this._iter();
        console.log("SpectronOutputMonitorService started");
    }

    _iter() {

        this._doLogForwarding();
        this._reschedule();

    }

    _doLogForwarding() {

        let client = this.app.client;

        if(client) {

            // right now e only forward the main because we can get the renderer
            // via the javascript console.
            client.getMainProcessLogs().then(function (logs: any[]) {
                logs.forEach(function (log) {
                    console.log("main: " + log);
                })

            })

            // right now e only forward the main because we can get the renderer
            // via the javascript console.
            client.getRenderProcessLogs().then(function (logs: any[]) {
                logs.forEach(function (log) {
                    //console.log("render: " + JSON.stringify(log, null, "  "));

                    // TODO: this is ALL we get for SEVERE.  We don't get an
                    // exception.  I think if there are args given to log.info or
                    // log.error they are not forwarded to us.

                    // render: {
                    //     "level": "SEVERE",
                    //         "message": "file:///home/burton/projects/polar-bookshelf/test/spectron/content-capture/app-bundle.js 10697:8 \"FIXME2: \"",
                    //         "source": "console-api",
                    //         "timestamp": 1532448719491
                    // }

                    // render: {
                    //     "level": "INFO",
                    //         "message": "file:///home/burton/projects/polar-bookshelf/test/spectron/content-capture/app-bundle.js 10750:16 \"IPC listener added for create-annotation\"",
                    //         "source": "console-api",
                    //         "timestamp": 1532443613553
                    // }

                    console.log(`render: ${log.timestamp} ${log.source} ${log.level}: ${log.message}` );

                });

            });

        } else {
            // noop
        }

    }

    _reschedule() {

        if(this.stopped) {
            return;
        }

        setTimeout(() => {
            this._doLogForwarding();
        }, TIMEOUT);

    }

    stop() {

        // do one more just to make sure we don't have any missing last moment
        // logs
        this._doLogForwarding();
        this.stopped = true;

        console.log("SpectronOutputMonitorService stopped");

    }

}
