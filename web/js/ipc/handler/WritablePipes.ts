import {ipcRenderer, BrowserWindow} from 'electron';
import {WritablePipe, WritablePipeFunction} from '../pipes/Pipe';
import {ElectronContext, ElectronContextType, ElectronRendererContext} from './ElectronContext';
import {ElectronContexts} from './ElectronContexts';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class WritablePipes {

    static createFromContext<M>(targetContext: ElectronContext): WritablePipe<M> {

        return WritablePipes.createFromFunction((channel: string, message: M) => {

            // create a response pipe based on the context of the request.

            let sourceContext = ElectronContexts.create();

            switch(sourceContext.type) {

                case ElectronContextType.MAIN:
                    WritablePipes.writeWithMainContext(targetContext, channel, message);
                    break;

                case ElectronContextType.RENDERER:
                    WritablePipes.writeWithRendererContext(targetContext, channel, message);
                    break;

                default:
                    throw new Error("Unknown context: " + sourceContext);

            }


        });

    }

    private static writeWithMainContext<M>(targetContext: ElectronContext, channel: string, message: M) {

        log.info("Writing with main process");

        switch(targetContext.type) {

            case ElectronContextType.MAIN:
                throw new Error("Can't write from main to main");

            case ElectronContextType.RENDERER:
                let electronRendererContext = <ElectronRendererContext>targetContext;
                BrowserWindow.fromId(electronRendererContext.windowReference.id).webContents.send(channel, message);
                break;

            default:
                throw new Error("Unknown context: " + targetContext);

        }

    }

    private static writeWithRendererContext<M>(targetContext: ElectronContext, channel: string, message: M) {

        log.info("Writing with renderer process");

        switch(targetContext.type) {

            case ElectronContextType.MAIN:
                log.info("Writing to main");
                // the main is where a renderer writes by default.
                ipcRenderer.send(channel, message);
                break;

            case ElectronContextType.RENDERER:
                let electronRendererContext = <ElectronRendererContext>targetContext;
                log.info("Writing to renderer: ", electronRendererContext);
                ipcRenderer.sendTo(electronRendererContext.windowReference.id, channel, message);
                break;

            default:
                throw new Error("Unknown context: " + targetContext);

        }

    }

    static createFromFunction<M>(writableFunction: WritableFunction<M>): WritablePipe<M> {
        return new WritablePipeFunction(writableFunction);
    }

}

export interface WritableFunction<M> {
    (channel: string, message: M): void;
}

