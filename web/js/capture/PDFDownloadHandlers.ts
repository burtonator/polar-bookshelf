import {BrowserWindow, DownloadItem, WebContents} from "electron";
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {ToasterMessages} from '../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../ui/toaster/Toaster';
import {ProgressTracker} from '../util/ProgressTracker';
import {ProgressMessages} from '../ui/progress_bar/ProgressMessages';
import {FileImportClient} from '../apps/repository/FileImportClient';
import {AppLauncher} from '../apps/main/AppLauncher';
import {Logger} from 'polar-shared/src/logger/Logger';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FileImportRequests} from '../apps/repository/FileImportRequests';

const log = Logger.create();

export class PDFDownloadHandlers {

    /**
     *
     * @param webContents  The webContents which needs download support.
     * @param onDownloaded Called when the download is complete.
     * @param onDownload Called when the download is started
     */
    public static create(webContents: WebContents,
                         onDownloaded: () => void = NULL_FUNCTION,
                         onDownload: () => void = NULL_FUNCTION) {

        // TODO: might not even need this handler here if we handle it in
        // the API and look at the mimeType there which is a better way
        // to handle this.

        const willDownloadHandler = (event: Event,
                                     downloadItem: DownloadItem,
                                     downloadWebContents: WebContents) => {

            log.info("Going to to download: ", downloadItem.getURL());

            const mimeType = downloadItem.getMimeType();

            // if (mimeType !== 'application/pdf') {
            //     log.warn("Downloading PDF and unable to handle: " + mimeType);
            //     return;
            // }

            const basename = FilePaths.basename(downloadItem.getURL());
            const tmpPath = FilePaths.createTempName(basename);

            // TODO: compute the path in the stash otherwise we're wasting IO
            // writing to two places... (unless we use a hard link).
            //
            // TODO: use a tmpdir within stash and then move it when finished
            log.info("Download PDF file to " + tmpPath);

            ToasterMessages.send({type: ToasterMessageType.INFO, message: "PDF download starting for " + basename});

            downloadItem.setSavePath(tmpPath);

            const progressTracker = new ProgressTracker(downloadItem.getTotalBytes(), 'download:' + basename);

            downloadItem.once('done', (event, state) => {

                // send the final progress event.
                ProgressMessages.broadcast(progressTracker.terminate());

                const message = `PDF download ${state} for ${basename}`;

                switch (state) {

                    case 'completed':
                        ToasterMessages.send({type: ToasterMessageType.SUCCESS, message});
                        FileImportClient.send(FileImportRequests.fromPath(tmpPath));

                        break;

                    case 'cancelled':
                        ToasterMessages.send({type: ToasterMessageType.WARNING, message});
                        break;

                    case 'interrupted':
                        ToasterMessages.send({type: ToasterMessageType.WARNING, message});
                        break;

                }

                onDownloaded();

            });

            downloadItem.on('updated', () => {

                const progress = progressTracker.abs(downloadItem.getReceivedBytes());
                ProgressMessages.broadcast(progress);

            });

            onDownload();

        };

        const session = webContents.session;

        session.addListener('will-download', willDownloadHandler);

        webContents.on('destroyed', () => {
            session.removeListener('will-download', willDownloadHandler);
        });

    }

}
