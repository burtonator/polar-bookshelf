import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocInfos} from './RepoDocInfos';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {MutationType, SnapshotProgress} from '../../../web/js/datastore/Datastore';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {IEventDispatcher, SimpleReactor} from '../../../web/js/reactor/SimpleReactor';
import {ProgressTrackerIndex} from '../../../web/js/util/ProgressTrackerIndex';
import {EventListener} from '../../../web/js/reactor/EventListener';
import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocMetas} from './RepoDocMetas';
import {DeterminateProgressBar} from '../../../web/js/ui/progress_bar/DeterminateProgressBar';
import {IndeterminateProgressBar} from '../../../web/js/ui/progress_bar/IndeterminateProgressBar';
import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class RepoDocMetaLoader {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly eventDispatcher: IEventDispatcher<RepoDocMetaEvent> = new SimpleReactor();

    constructor(persistenceLayerManager: PersistenceLayerManager) {
        this.persistenceLayerManager = persistenceLayerManager;
    }

    public addEventListener(listener: EventListener<RepoDocMetaEvent>) {
        return this.eventDispatcher.addEventListener(listener);
    }

    public removeEventListener(listener: EventListener<RepoDocMetaEvent>) {
        return this.eventDispatcher.removeEventListener(listener);
    }

    public dispatchEvent(event: RepoDocMetaEvent) {
        this.eventDispatcher.dispatchEvent(event);
    }

    public async start() {

        // TODO: handle events properly..

        this.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'changed') {
                this.onPersistenceLayerChanged(event.persistenceLayer);
            }

        }, 'changed');

    }

    private onPersistenceLayerChanged(persistenceLayer: PersistenceLayer) {

        log.info("onPersistenceLayerChanged");

        this.addInitialProgressListener(persistenceLayer);

        const progressTrackerIndex = new ProgressTrackerIndex();

        persistenceLayer.addDocMetaSnapshotEventListener(async docMetaSnapshotEvent => {

            const eventHandler = async () => {

                const {progress, docMetaMutations} = docMetaSnapshotEvent;

                progressTrackerIndex.update(progress);

                const minProgress = progressTrackerIndex.min();

                if (minProgress.isPresent()) {
                    DeterminateProgressBar.update(minProgress.get());
                } else {
                    DeterminateProgressBar.update(100);
                }

                const mutations: RepoDocMetaMutation[] = [];

                for (const docMetaMutation of docMetaMutations) {

                    if (docMetaMutation.mutationType === 'created' ||
                        docMetaMutation.mutationType === 'updated') {

                        const docMeta = await docMetaMutation.docMetaProvider();
                        const docInfo = docMeta.docInfo;

                        const persistenceLayerProvider = () => this.persistenceLayerManager.get();

                        const repoDocMeta = this.toRepoDocMeta(persistenceLayerProvider, docInfo.fingerprint, docMeta);

                        if (repoDocMeta && RepoDocInfos.isValid(repoDocMeta.repoDocInfo)) {

                            mutations.push({
                                mutationType: docMetaMutation.mutationType,
                                fingerprint: docMetaMutation.fingerprint,
                                repoDocMeta
                            });

                        }

                    }

                    if (docMetaMutation.mutationType === 'deleted') {

                        mutations.push({
                            mutationType: docMetaMutation.mutationType,
                            fingerprint: docMetaMutation.fingerprint,
                        });

                    }

                }

                if (docMetaMutations.length > 0) {
                    this.eventDispatcher.dispatchEvent({mutations, progress});
                }

            };

            eventHandler()
                .catch(err => log.error("Could not handle snapshot: ", err));

        });

    }

    private addInitialProgressListener(persistenceLayer: PersistenceLayer) {

        let progressBar = IndeterminateProgressBar.create();

        persistenceLayer.addDocMetaSnapshotEventListener(async () => {

            if (progressBar) {
                progressBar.destroy();
                progressBar = null!;
            }

        });

    }


    private toRepoDocMeta(persistenceLayerProvider: PersistenceLayerProvider,
                          fingerprint: string,
                          docMeta?: IDocMeta): RepoDocMeta | undefined {

        if (docMeta) {

            return RepoDocMetas.convert(persistenceLayerProvider, fingerprint, docMeta);

        } else {
            log.warn("No DocMeta for fingerprint: " + fingerprint);
        }

        return undefined;

    }

}

export interface RepoDocMetaEvent {
    readonly mutations: ReadonlyArray<RepoDocMetaMutation>;
    readonly progress: SnapshotProgress;
}

export interface RepoDocMetaMutation {
    readonly mutationType: MutationType;
    readonly fingerprint: string;

    // only present on created / updated
    readonly repoDocMeta?: RepoDocMeta;
}
