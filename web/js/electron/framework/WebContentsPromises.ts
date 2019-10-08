import {WebContents, Event} from 'electron';

export class WebContentsPromises {

    public static once(webContents: WebContents): Once {

        return new Once(webContents);
    }

    public static executeJavaScript<T>(webContents: WebContents, code: string, userGesture?: boolean) {
        return webContents.executeJavaScript(code, userGesture);
    }

}

class Once {

    private readonly webContents: WebContents;

    constructor(webContents: WebContents) {
        this.webContents = webContents;
    }

    public load(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            this.didFinishLoad()
                .then(() => resolve())
                .catch(err => reject(err));

            this.didFailLoad()
                .then((failLoad: FailLoad) => reject(failLoad))
                .catch(err => reject(err));

        });

    }

    public didFinishLoad(): Promise<void> {

        return new Promise<void>(resolve => {
            this.webContents.once('did-finish-load', () => {
                resolve();
            });
        });

    }

    public didFailLoad(): Promise<FailLoad> {

        return new Promise<FailLoad>(resolve => {
            this.webContents.once('did-fail-load', (event: Event,
                                                    errorCode: number,
                                                    errorDescription: string,
                                                    validatedURL: string,
                                                    isMainFrame: boolean) => {

                // TODO: would be nice if there were a way to take method arguments
                // and make them an object.

                const failLoad = new FailLoad(event, errorCode, errorDescription, validatedURL, isMainFrame);
                resolve(failLoad);

            });

        });

    }

    public async didAttachWebview(): Promise<WebContents> {

        return new Promise<WebContents>(resolve => {
            this.webContents.once('did-attach-webview', (event: Event, webContents: WebContents) => {
                resolve(webContents);
            });
        });

    }

}

export class FailLoad {

    public event: Event;
    public errorCode: number;
    public errorDescription: string;
    public validatedURL: string;
    public isMainFrame: boolean;

    constructor(event: Electron.Event, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean) {
        this.event = event;
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.validatedURL = validatedURL;
        this.isMainFrame = isMainFrame;
    }

}
