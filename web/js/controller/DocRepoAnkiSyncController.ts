import {Logger} from 'polar-shared/src/logger/Logger';
import {SyncProgressListener} from '../apps/sync/framework/SyncProgressListener';
import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {IEventDispatcher} from '../reactor/SimpleReactor';
import {SyncBarProgress} from '../ui/sync_bar/SyncBar';
import {AnkiSyncEngine} from '../apps/sync/framework/anki/AnkiSyncEngine';
import {DocMetaSupplierCollection} from '../metadata/DocMetaSupplierCollection';
import {IProvider} from 'polar-shared/src/util/Providers';
import {RendererAnalytics} from '../ga/RendererAnalytics';

const log = Logger.create();

export class DocRepoAnkiSyncController {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;
    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>, syncBarProgress: IEventDispatcher<SyncBarProgress>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.syncBarProgress = syncBarProgress;
    }

    public start() {
        window.addEventListener("message", event => this.onMessageReceived(event), false);
    }

    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        const triggerEvent = event.data;

        switch (event.data.type) {

            case "start-anki-sync":
                this.onStartSync()
                    .catch(err => log.error("Failed to start sync: ", err));

                break;

        }

        log.info("started");

    }

    private async onStartSync() {

        RendererAnalytics.event({category: 'anki', action: 'sync-started'});

        let nrTasks = 0;
        let nrFailedTasks = 0;

        const syncProgressListener: SyncProgressListener = syncProgress => {

            log.info("Sync progress: ", syncProgress);

            syncProgress.taskResult.map(taskResult => ++nrTasks);

            syncProgress.taskResult
                .filter(taskResult => taskResult.failed === true)
                .map(taskResult => ++nrFailedTasks);

            let message: string | undefined;

            syncProgress.taskResult.when(taskResult => {
                message = taskResult.message;
            });

            this.syncBarProgress.dispatchEvent({
                task: 'anki-sync',
                message,
                percentage: syncProgress.percentage
            });

        };

        const ankiSyncEngine = new AnkiSyncEngine();

        const persistenceLayer = this.persistenceLayerProvider.get();

        const docMetaFiles = await persistenceLayer.getDocMetaRefs();

        const docMetaSuppliers: DocMetaSupplierCollection
            = docMetaFiles.map(docMetaFile => {
                return async () => {
                    log.info("Reading docMeta for anki sync: " + docMetaFile.fingerprint);
                    return (await persistenceLayer.getDocMeta(docMetaFile.fingerprint))!;
                };
            });

        const pendingSyncJob = await ankiSyncEngine.sync(docMetaSuppliers, syncProgressListener);

        this.syncBarProgress.dispatchEvent({
            task: 'anki-sync',
            message: "Starting anki sync...",
            percentage: 0
        });

        await pendingSyncJob.start();

        this.syncBarProgress.dispatchEvent({
            task: 'anki-sync',
            message: `Anki sync complete. Completed ${nrTasks} with ${nrFailedTasks} failures.`,
            percentage: 100
        });

        RendererAnalytics.event({category: 'anki', action: 'sync-completed-' + nrTasks});
        RendererAnalytics.event({category: 'anki', action: 'sync-failed-' + nrFailedTasks});

    }

}
