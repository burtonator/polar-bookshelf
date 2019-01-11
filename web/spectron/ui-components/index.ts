import {SpectronMain2} from '../../js/test/SpectronMain2';
import {DownloadItem, WebContents} from "electron";

SpectronMain2.create().run(async state => {

    state.window.loadURL(`file://${__dirname}/content.html`);

    state.window.webContents.session.addListener('will-download', (event: Event,
                                                                   downloadItem: DownloadItem,
                                                                   downloadWebContents: WebContents) => {

        console.log("Within download handler");

        downloadItem.setSavePath('/tmp/test.pdf');

    });


    // await state.testResultWriter.write(true);

});

