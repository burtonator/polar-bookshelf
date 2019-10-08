import {ipcMain, ipcRenderer} from 'electron';

/**
 * Determine whether this distribution is running in the browser or within
 * electron.
 */
export class DistRuntime {

    public static get(): DistRuntimeType {

        if (ipcRenderer) {
            return 'electron';
        } else if (ipcMain) {
            return 'electron';
        } else {
            return 'browser';
        }

    }

}

export type DistRuntimeType = 'browser' | 'electron';
