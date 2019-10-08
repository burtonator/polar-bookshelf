export class Tabs {

    public static loadLinkInNewTab(link: string) {
        chrome.tabs.create({url: link});
    }

    public static queryCurrentTabForLink() {

        return new Promise<string>(resolve => {

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
                const link = tabs[0].url;
                resolve(link);
            });

        });

    }

}
