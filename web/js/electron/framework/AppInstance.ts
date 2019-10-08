import {ipcRenderer} from 'electron';

/**
 * @ElectronRendererContext
 */
export class AppInstance {

    public static notifyStarted(name: string) {

        if (!ipcRenderer) {
            return;
        }

        ipcRenderer.send('app-instance-started:' + name);

    }

}
