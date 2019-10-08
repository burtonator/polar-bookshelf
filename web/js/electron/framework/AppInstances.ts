import {ipcMain} from 'electron';

/**
 * AppInstance and AppInstances provided a simple way for main and the renderer
 * to communicate that an webapp is launched in a simple manner.
 *
 * @ElectronMainContext
 */
export class AppInstances {

    public static waitForStarted(name: string) {
        return new Promise<void>(resolve => {

            ipcMain.once('app-instance-started:' + name, () => {
                resolve();
            });

        });

    }

}
