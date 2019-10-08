import {ImportContentAPI} from './ImportContentAPI';

export class ImportContentHandler {

    public static register() {

        chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

            const isHandled = (): boolean => {
                return message && message.type && message.type === 'polar-extension-import-content';
            };

            const isAuthorized = (): boolean => {

                if (! sender.url) {
                    // sender must have a URL
                    return false;
                }

                if (! sender.url.startsWith("https:")) {
                    // must be secure
                    return false;
                }

                const url = new URL(sender.url);

                if (! url.hostname) {
                    return false;
                }

                return url.hostname.endsWith(".getpolarized.io");

            };

            if (isHandled()) {

                if (isAuthorized()) {

                    const link: string = message.link;
                    const contentType: string | undefined = message.contentType;

                    ImportContentAPI.doImport(link, contentType)
                        .then(() => {
                            sendResponse({success: true});
                        })
                        .catch(err => {
                            console.error("Unable to import ");
                            sendResponse({success: false, message: err.message});
                        });

                }

            }

        });

    }

}

