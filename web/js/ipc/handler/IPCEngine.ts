import {IPCMessage} from './IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IPCPipe} from './IPCPipe';
import {IPCError} from './IPCError';
import {IPCEvent} from './IPCEvent';

const log = Logger.create();

export class IPCEngine<E extends IPCEvent> {

    public readonly registry: IPCRegistry;

    private readonly pipe: IPCPipe<E>;

    constructor(pipe: IPCPipe<E>, registry: IPCRegistry) {
        this.pipe = pipe;
        this.registry = registry;
    }

    public start() {

        this.registry.entries().forEach(ipcRegistration => {

            this.pipe.on(ipcRegistration.path, (pipeNotification) => {

                (async () => {

                    const event = pipeNotification.event;

                    const ipcRequest = IPCMessage.create(pipeNotification.message);

                    let ipcResponse: IPCMessage<any>;

                    try {

                        let result =  await ipcRegistration.handler.handle(event, ipcRequest);

                        if( ! result) {
                            // we don't have a result given to us from the handler
                            // we just return true in this situation.
                            result = true;
                        }

                        ipcResponse = new IPCMessage('result', result);

                        // TODO: if the result is a promise, await the promise...

                    } catch (err) {

                        log.error("Encountered error with handler: ", err);

                        // catch any exceptions so that handlers don't have to be
                        // responsible for error handling by default.

                        ipcResponse = IPCMessage.createError('error', IPCError.create(err));

                    }

                    // event.responsePipe.write('/ipc-trace', new IPCMessage('trace', {
                    //     request: ipcRequest,
                    //     response: ipcResponse
                    // }));

                    event.responsePipe.write(ipcRequest.computeResponseChannel(), ipcResponse);

                })().catch(err => log.error(`Unable to handle IPC at ${ipcRegistration.path}: `, err));

            });

        });

    }

}
