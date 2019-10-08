import {Logger} from 'polar-shared/src/logger/Logger';
import {BrowserWindow} from "electron";
import {TestResultWriter} from '../TestResultWriter';
import {Functions} from 'polar-shared/src/util/Functions';
import {TestResult} from '../renderer/TestResult';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter implements TestResultWriter {

    private mainWindow: Electron.BrowserWindow;


    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    public async write(result: any): Promise<void> {

        if (result === null || result === undefined) {
            throw new Error("No result given!");
        }

        log.info("Writing test result: ", result);

        const browserWindows = BrowserWindow.getAllWindows();

        for (const browserWindow of browserWindows) {

            const script = Functions.toScript(TestResult.set, result);

            await browserWindow.webContents.executeJavaScript(script);

        }

    }

}
