import {ipcRenderer} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {TestResult} from './renderer/TestResult';
import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {app} from 'electron';

const log = Logger.create();


/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
export class TestResultService {

    /**
     * Start the service by listening to messages posted.
     */
    public start(): void {

        Preconditions.assertPresent(ipcRenderer, "No ipcRenderer");

        ipcRenderer.on('test-result', (event: Electron.Event, data: any) => {

            const ipcMessage = IPCMessage.create(data);

            if (ipcMessage.type === "write") {
                 this.onWrite(ipcMessage);
            }

            if (ipcMessage.type === "ping") {
                this.onPing(event, ipcMessage);
            }


        });

        // tell everyone we've started now
        ipcRenderer.send("test-result", { type: "started" });

    }

    public onPing(event: Electron.Event, ipcMessage: IPCMessage<any>) {

        const pongMessage = new IPCMessage("pong", true);

        event.sender.send(ipcMessage.computeResponseChannel(), pongMessage);

    }

    public onWrite(data: any) {

        if (! Optional.present(TestResult.get())) {

            const ipcMessage = IPCMessage.create(data);

            if (Optional.present(ipcMessage.value)) {

                TestResult.set(ipcMessage.value);

                log.info("Received test result: " + JSON.stringify(TestResult.get()));

            } else if (data.err) {
                // TODO: right now we do not set the err...
            } else {
                log.error("Given neither result nor err: ", data);
            }

        } else {
            // TODO consider telling the sender.
            log.error("Existing test results already defined.: " + data.value);
        }

    }


}
