
// keep the request index built so I can determine the original request to read
// the origin.
const HOST = 'app.getpolarized.io';

const INITIAL_URL = `https://${HOST}/?utm_source=app_on_install&utm_medium=chrome_extension`;


function loadLink(url: string) {
    chrome.tabs.create({ url });
}

export class InitialSplash {

    public static register() {

        // TODO move this to a dedicated file for handling the initial page load.

        chrome.runtime.onInstalled.addListener(() => {

            if (localStorage.getItem('has-downloaded') !== 'true') {
                loadLink(INITIAL_URL);
                localStorage.setItem('has-downloaded', 'true');
            } else {
                // noop
            }

        });

    }

}
