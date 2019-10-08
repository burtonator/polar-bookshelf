export class Handlers {

    /**
     * I don't think this is necessarily required .
     */
    public static isAuthorized(sender: chrome.runtime.MessageSender) {

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

    }

}
