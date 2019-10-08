import {DataURL} from '../web/js/util/DataURLs';


const EXTENSION_IDS = [
    "alennbmnfgmkcmfkcnlhpofncmalokfc", // dev
    "jkfdkjomocoaljglgddnmhcbolldcafd"  // prod
];

export namespace webextensions {

    export class Runtime {

        public static async sendMessage(extensionID: string, message: any): Promise<any> {

            return new Promise<any>(resolve => {
                chrome.runtime.sendMessage(extensionID, message, result => resolve(result));
            });

        }

    }

    /**
     * Reliably sends a message to OUR extension.
     */
    export class Messaging {

        public static async sendMessage(message: any): Promise<any> {

            for (const extension of EXTENSION_IDS) {

                const result = await Runtime.sendMessage(extension, message);

                if (result) {
                    // will be null if nothing saw the call
                    return result;
                }

            }

            console.warn("No results from any web extensions with IDs: ", EXTENSION_IDS);

            return null;

        }

    }

    export class Windows {

        public static async getCurrent(): Promise<chrome.windows.Window> {

            return new Promise(resolve => {

                chrome.windows.getCurrent(window => {
                    resolve(window);
                });

            });

        }

    }

    export class Tabs {

        public static async captureVisibleTab(): Promise<DataURL> {

            const win = await Windows.getCurrent();

            return new Promise(resolve => {

                chrome.tabs.captureVisibleTab(win.id, {format: 'png'}, dataURL => {
                    resolve(dataURL);
                });

            });

        }

    }

}
