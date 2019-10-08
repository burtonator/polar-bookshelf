import {ImportContentAPI} from './ImportContentAPI';

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function queryCurrentTabForLink() {

    return new Promise<string>(resolve => {

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
            const link = tabs[0].url;
            resolve(link);
        });

    });

}

function toggleVisibility(selector: string) {

    const element = <HTMLElement> document.querySelector(selector);

    if(! element) {
        return;
    }

    if(element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }

}


function showError() {

    toggleVisibility(".saving");
    toggleVisibility(".failure");

}


function showSuccess() {

    toggleVisibility(".saving");
    toggleVisibility(".success");

}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

/**
 * Called when the user clicks the button in the page to 'share' with Polar.
 */
async function onExtensionActivated() {

    // TODO: if they hit share on the PDF viewer itself try to unwrap the file
    // URL and send that instead.

    const link = await queryCurrentTabForLink();

    await ImportContentAPI.doImport(link!, document.contentType);

    showSuccess();
    closeWindowAfterDelay();
    console.log("success");

}

function setupLinkHandlers() {

    document.querySelector("#download-link")!.addEventListener('click', () => {
        loadLinkInNewTab('https://getpolarized.io/download.html?utm_source=chrome_extension_failed&utm_medium=chrome_extension');
    });

}

document.addEventListener("DOMContentLoaded", () => {

    setupLinkHandlers();

    onExtensionActivated()
        .catch(err => {
            console.log("failed");
            showError();
            closeWindowAfterDelay();
            console.error("Unable to send URL to polar: ", err)
        });

});
