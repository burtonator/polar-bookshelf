import {webContents} from 'electron';
import WebContents = Electron.WebContents;

export class BrowserWindows {

    /**
     * Go through all windows and compute an index of the host browser window
     * and the hosted WebContents. This is used to find out which root windows
     * are hosting webContents.
     */
    // public static computeWebContentsToHostIndex(): WebContentsHostIndex {
    //
    //     const result = new WebContentsHostIndex();
    //
    //     const allWebContents = webContents.getAllWebContents();
    //
    //     for (const current of allWebContents) {
    //
    //         if (current.hostWebContents) {
    //             result.register(current.hostWebContents, current);
    //         }
    //
    //     }
    //
    //     return result;
    //
    // }

}

/**
 * An index of id to hosted web contents.
 */
export class WebContentsHostIndex {

    public readonly keys: number[] = [];

    private readonly index: {[key: number]: WebContents[]} = {};

    public register(host: WebContents, child: WebContents) {

        if (! this.index[host.id]) {
            this.index[host.id] = [];
            this.keys.push(host.id);
        }

        this.index[host.id].push(child);

    }

    public get(id: number): WebContents[] {

        if (! this.index[id]) {
            return [];
        }

        return this.index[id];

    }

}
