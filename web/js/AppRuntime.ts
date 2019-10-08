import {ipcMain, ipcRenderer} from 'electron';

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export class AppRuntime {

    public static get(): AppRuntimeName {

        if (ipcRenderer) {
            return 'electron-renderer';
        } else if (ipcMain) {
            return 'electron-main';
        } else {
            return 'browser';
        }

    }

    /**
     * A higher level runtime type (electron or browser)
     */
    public static type(): AppRuntimeType {

        switch (this.get()) {

            case 'electron-renderer':
                return 'electron';

            case 'electron-main':
                return 'electron';

            case 'browser':
                return 'browser';

        }

    }

    public static isElectron() {
        return this.get().startsWith('electron-');
    }

    public static isBrowser() {
        return this.get() === 'browser';
    }

}

export type AppRuntimeName = 'electron-renderer' | 'electron-main' | 'browser';

export type AppRuntimeType = 'electron' | 'browser';

