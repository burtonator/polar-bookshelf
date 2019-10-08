import {Handlers} from './Handlers';

export class ExtensionInstallHandler {

    public static register() {

        chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

            if (this.isHandled(message)) {

                if (Handlers.isAuthorized(sender)) {
                    sendResponse({installed: true});
                }

            }

        });

    }

    private static isHandled(message: any) {
        return message && message.type && message.type === 'install';
    }

}

