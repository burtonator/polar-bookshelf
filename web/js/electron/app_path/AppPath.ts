import {app, remote} from 'electron';
import {ElectronContextType} from '../context/ElectronContextType';
import {ElectronContextTypes} from '../context/ElectronContextTypes';

declare var global: any;

if (app) {
    global.appPath = app.getAppPath();
}

/**
 * Provides a more reliable way to set the 'appPath' that Electron uses to
 * find the root directory for resources.  It works from both the renderer and
 * main contexts.
 */
export class AppPath {

    public static get() {

        const electronContext =  ElectronContextTypes.create();

        if (electronContext === ElectronContextType.RENDERER) {
            return remote.getGlobal("appPath");
        } else {
            return global.appPath;
        }

    }

    public static set(appPath?: string) {

        const electronContext =  ElectronContextTypes.create();

        if (electronContext === ElectronContextType.RENDERER) {
            throw new Error("Call set from main context.");
        }

        global.appPath = appPath;

    }

}
