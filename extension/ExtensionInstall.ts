import {webextensions} from './WebExtensions';

export class ExtensionInstall {

    public static async isInstalled(): Promise<boolean> {

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            const result = await webextensions.Messaging.sendMessage({});
            return result !== null;
        }

        return false;

    }

}
