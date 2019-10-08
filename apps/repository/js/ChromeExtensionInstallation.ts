import {AppRuntime} from '../../../web/js/AppRuntime';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';
import {isPresent} from 'polar-shared/src/Preconditions';

const EXTENSION_URL = "https://chrome.google.com/webstore/detail/jkfdkjomocoaljglgddnmhcbolldcafd";

// https://developer.chrome.com/webstore/inline_installation
/**
 * @Deprecated chrome inline installation no longer works so I think most of
 * this code is pointless but we might be able to use the isInstalled feature
 * to detect if the extension is already installed.
 */
export class ChromeExtensionInstallation {

    public static isChromeOrChromium() {
        return navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Chromium");
    }

    public static isSupported() {
        return AppRuntime.isBrowser() && this.isChromeOrChromium();
    }

    public static requiresInstall() {
        return this.isSupported() && ! localStorage.getItem("skip-extension");
    }

    public static isInstalled() {

        // we don't have a type for this yet.
        const anyChrome: any = chrome;

        if (! anyChrome) {
            return false;
        }

        // no typescript bindings...
        const app: any = anyChrome.app;

        if (! app) {
            return false;
        }

        return isPresent(app.isInstalled) && app.isInstalled;
    }

    /**
     *
     * Trigger the online installation of the extension.
     */
    public static doInstall(successCallback: () => void,
                            failureCallback: (error: string, errorCode?: string) => void) {

        RendererAnalytics.event({category: 'chrome-extension', action: 'inline-installation-triggered'});

        const handleSuccess = () => {
            RendererAnalytics.event({category: 'chrome-extension-install-result', action: 'install-successful'});
            successCallback();
        };

        const handleFailure = (error: string, errorCode?: string) => {

            RendererAnalytics.event({category: 'chrome-extension-install-result', action: 'install-failed'});

            if (errorCode) {
                RendererAnalytics.event({category: 'chrome-extension-failures', action: errorCode});
            }

            failureCallback(error, errorCode);
        };

        chrome.webstore.install(EXTENSION_URL, handleSuccess, handleFailure);

    }

}
