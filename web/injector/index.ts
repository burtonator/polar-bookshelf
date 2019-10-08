import {BrowserWindow} from "electron";

declare var window: any;

/**
 * Called from the renderer so that messages can be injected into a BrowserWindow
 * from the main process.
 */
export class InjectorService {

    public static create() {

        console.log("Injector created and listening for code to require");

        window.addEventListener("message", (event: MessageEvent) => {

            if (event.data.type === 'injector-require') {
                console.log("Injecting code via require: " + event.data.src);
                require(event.data.src);
            }

        });

    }

}

export class Injector {

    public static async inject(browserWindow: BrowserWindow, path: string) {

        const message = {
            type: 'injector-require',
            src: path
        };

        const script = `window.postMessage(${JSON.stringify(message)}, '*')`;

        await browserWindow.webContents.executeJavaScript(script);

    }

}

export function create() {
    InjectorService.create();
}
